#!/usr/bin/env python3
from flask import session, make_response, jsonify, request
from flask import request, make_response, session, abort, jsonify
from flask_restful import Resource, Api
from config import app, db, api
from flask import Flask
from sqlalchemy.exc import IntegrityError
from models import User, Cosmetic, Provider, Category, CosmeticCategory
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object('config')
app.secret_key = "a9S71qLfI\bc2_),4E\oX3pEHZ~vBcK6u}678?k"
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})
api = Api(app)
db.init_app(app)


@app.route('/')
def index():
    response_body = '<h1>Welcome to Beauty Bazaar!</h1>'
    return make_response(response_body, 200)

# --- Authentication Endpoints ---


class Signup(Resource):
    def post(self):
        json_data = request.get_json()
        username = json_data.get('username')
        email = json_data.get('email')
        password = json_data.get('password')

        if username and password and email:
            # Check if user already exists
            existing_user_username = User.query.filter_by(
                username=username).first()
            existing_user_email = User.query.filter_by(email=email).first()

            if existing_user_username:
                return make_response({"error": "Username already exists"}, 400)
            if existing_user_email:
                return make_response({"error": "Email already exists"}, 400)

            new_user = User(username=username, email=email)
            new_user.password = password

            try:
                db.session.add(new_user)
                db.session.commit()
                session['user_id'] = new_user.id
                return make_response(new_user.to_dict(), 201)
            # Handles other Integrity Errors, like if the email, or username, somehow, was not caught before.
            except IntegrityError:
                db.session.rollback()
                return make_response({"error": "User could not be created"}, 400)
            except Exception as e:
                db.session.rollback()
                return make_response({"error": str(e)}, 500)

        return make_response({"error": "Missing required fields"}, 400)


api.add_resource(Signup, "/api/signup")


class Login(Resource):
    def post(self):
        print("post request...")
        json_data = request.get_json()

        username = json_data.get('username')
        password = json_data.get('password')

        print("username:", username)
        print("password:", password)

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id  # Store user session
            return make_response(({"message": "Login successful"}), 200)

        return make_response(({"error": "Invalid username or password"}), 401)


# Register the resource
api.add_resource(Login, "/api/login")


class Logout(Resource):
    def post(self):
        """
        Logs out the user by clearing the session.
        """
        user_id = session.get('user_id')
        print("user_id", user_id)
        if 'user_id' in session:
            del session['user_id']  # Clear the user_id from the session
            return make_response(jsonify({"message": "Logout successful"}), 200)
        else:
            return make_response(jsonify({"error": "No user logged in"}), 401)


api.add_resource(Logout, "/api/logout")

# --- Cosmetics Endpoints ---


class Cosmetics(Resource):
    def get(self, cosmetic_id=None):
        user_id = session.get('user_id')
        user = db.session.get(User, user_id)

        if not user_id:
            return make_response(jsonify({"data": []}), 200)

        if cosmetic_id is None:  # Get all cosmetics for the user
            cosmetics_list = []
            for cosmetic in user.cosmetics:
                provider = db.session.get(Provider, cosmetic.provider_id)
                provider_name = provider.name if provider else "Provider not found"

                category_names = []
                if cosmetic.categories:
                    if isinstance(cosmetic.categories, int):  # handle single category case
                        category = db.session.get(
                            Category, cosmetic.categories)
                        category_names.append(
                            category.name if category else "Category not found")
                    else:
                        for category_id in cosmetic.categories:
                            category = db.session.get(Category, category_id.id)
                            category_names.append(
                                category.name if category else "Category not found")

                cosmetics_list.append({
                    "id": cosmetic.id,
                    "name": cosmetic.name,
                    "brand": cosmetic.brand,
                    "description": cosmetic.description,
                    "provider": provider_name,
                    "categories": category_names,
                })
            return make_response(jsonify({"data": cosmetics_list}), 200)
        else:  # Get a specific cosmetic
            user_id = session.get('user_id')
            cosmetic = db.session.get(Cosmetic, cosmetic_id)

            if cosmetic and cosmetic.user_id == user_id:
                provider = db.session.get(Provider, cosmetic.provider_id)
                provider_name = provider.name if provider else "Provider not found"

                category_data = []
                if cosmetic.categories:
                    for category in cosmetic.categories:
                        # Find the CosmeticCategory entry for this cosmetic and category
                        cosmetic_category = CosmeticCategory.query.filter_by(
                            cosmetic_id=cosmetic.id, category_id=category.id).first()

                        note = cosmetic_category.notes if cosmetic_category else None

                        category_data.append({
                            "name": category.name,
                            "note": note
                        })

                return make_response(jsonify({
                    "id": cosmetic.id,
                    "name": cosmetic.name,
                    "brand": cosmetic.brand,
                    "description": cosmetic.description,
                    "provider": provider_name,
                    "categories": category_data,  # Return category data with names and notes
                }), 200)
            else:
                return make_response(jsonify({"error": "Cosmetic not found"}), 404)

    def post(self, cosmetic_id=None):
        if cosmetic_id is None:  # create new cosmetic
            data = request.get_json()
            try:
                new_cosmetic = Cosmetic(
                    name=data['name'],
                    brand=data.get('brand', ''),
                    description=data.get('description', ''),
                    price=data.get('price', 0.0),
                    user_id=session.get('user_id'),
                )

                provider_name = data.get("provider")
                if provider_name:
                    provider = Provider.query.filter_by(
                        name=provider_name).first()
                    if provider:
                        new_cosmetic.provider_id = provider.id

                db.session.add(new_cosmetic)
                # to get the new_cosmetic id, before commit.
                db.session.flush()

                categories = data.get("categories", [])
                note = data.get("categoryNote", None)

                for category_name in categories:
                    category = Category.query.filter_by(
                        name=category_name).first()
                    if category:
                        new_cosmetic_category = CosmeticCategory(
                            cosmetic_id=new_cosmetic.id,
                            category_id=category.id,
                            notes=note
                        )
                        db.session.add(new_cosmetic_category)

                db.session.commit()
                return make_response(jsonify({"success": "Cosmetic updated"}), 201)
            except Exception as e:
                print("error 1", e)
                db.session.rollback()
                return make_response({"error": str(e)}, 400)
        else:  # update cosmetic
            data = request.get_json()
            cosmetic = db.session.get(Cosmetic, cosmetic_id)
            user_id = session.get('user_id')
            if cosmetic and cosmetic.user_id == user_id:
                try:
                    cosmetic.name = data['name']
                    cosmetic.brand = data.get('brand', '')
                    cosmetic.description = data.get('description', '')
                    cosmetic.price = data.get('price', 0.0)

                    provider_name = data.get("provider")
                    if provider_name:
                        provider = Provider.query.filter_by(
                            name=provider_name).first()
                        if provider:
                            cosmetic.provider_id = provider.id

                    # Clear existing categories and add new ones
                    CosmeticCategory.query.filter_by(
                        cosmetic_id=cosmetic.id).delete()

                    categories = data.get("categories", [])
                    note = data.get("categoryNote", None)

                    for category_name in categories:
                        category = Category.query.filter_by(
                            name=category_name).first()
                        if category:
                            new_cosmetic_category = CosmeticCategory(
                                cosmetic_id=cosmetic.id,
                                category_id=category.id,
                                notes=note
                            )
                            db.session.add(new_cosmetic_category)

                    db.session.commit()
                    return make_response(jsonify({"success": "Cosmetic updated"}), 200)
                except Exception as e:
                    print("error ", e)
                    db.session.rollback()
                    return make_response({"error": str(e)}, 400)
            else:
                return make_response({"error": "Cosmetic not found or unauthorized"}, 404)

    def delete(self, cosmetic_id):
        cosmetic = db.session.get(Cosmetic, cosmetic_id)
        user_id = session.get('user_id')
        if cosmetic and cosmetic.user_id == user_id:
            try:
                db.session.delete(cosmetic)
                db.session.commit()
                # 204 No Content for successful deletion
                return make_response('', 204)
            except Exception as e:
                db.session.rollback()
                return make_response({"error": str(e)}, 400)
        else:
            return make_response({"error": "Cosmetic not found or unauthorized"}, 404)


api.add_resource(Cosmetics, "/api/cosmetics",
                 "/api/cosmetics/<int:cosmetic_id>")
# --- Users Endpoints ---


class UsersResource(Resource):
    def get(self):
        users = User.query.all()
        users_list = []
        for user in users:
            users_list.append(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                }
            )
        return make_response(jsonify({"data": users_list}), 200)

    def post(self):
        data = request.get_json()
        try:
            new_user = User(
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            db.session.add(new_user)
            db.session.commit()
            return make_response(new_user.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 400)


api.add_resource(UsersResource, "/api/users")

# --- Categories Endpoint ---


@app.route('/api/all_categories', methods=['GET'])
def get_all_categories():
    user_id = session.get('user_id')
    print("DEBUG: User ID in session:", user_id)
    user = db.session.get(User, user_id)

    if not user_id:
        return make_response(jsonify({"data": []}), 200)

    all_categories = Category.query.all()
    unique_categories = set()
    category_list = []

    for category in all_categories:
        if category.id not in unique_categories:
            print(f"Category: {category.name}")
            category_list.append({
                "id": category.id,
                "name": category.name
            })
            unique_categories.add(category.id)

    print("category_list", category_list)

    return make_response(jsonify({"data": category_list}), 200)


@app.route('/api/my_categories', methods=['GET'])
def get_categories():
    user_id = session.get('user_id')
    print("DEBUG: User ID in session:", user_id)
    user = db.session.get(User, user_id)

    if not user_id or not user:
        return make_response(jsonify({"data": []}), 200)

    category_set = set()  # Use a set to store unique categories
    category_list = []

    if user:
        for cosmetic in user.cosmetics:
            for category in cosmetic.categories:
                if category.id not in category_set:  # Check if category is already in the set
                    print(f"Category: {category.name}")
                    category_list.append({
                        "id": category.id,
                        "name": category.name
                    })
                    category_set.add(category.id)  # Add category ID to the set

        print("category_list", category_list)

    return make_response(jsonify({"data": category_list}), 200)


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')  # Retrieve user_id from session
        print("user_id ", user_id)
        if not user_id:
            return make_response(jsonify({"error": "Not logged in"}), 401)

        user = User.query.get(user_id)
        if user:
            return make_response(jsonify({"username": user.username, "email": user.email}), 200)

        return make_response(jsonify({"error": "User not found"}), 404)


api.add_resource(CheckSession, "/api/check_session")


class ProvidersResource(Resource):
    def get(self, provider_id=None):
        if provider_id:
            provider = db.session.get(Provider, provider_id)

            if provider:
                # Serialize cosmetics to a list of dictionaries
                cosmetics_list = [
                    {
                        'id': cosmetic.id,
                        'name': cosmetic.name,
                        'brand': cosmetic.brand,
                    }
                    for cosmetic in provider.cosmetics
                ]

                provider_data = {
                    'name': provider.name,
                    'contact_info': provider.contact_info,
                    'cosmetics': cosmetics_list,
                }
                return make_response(jsonify(provider_data), 200)
            else:
                return make_response(jsonify({'error': 'Provider not found'}), 404)
        else:
            providers = Provider.query.all()
            providers_list = []

            for provider in providers:
                providers_list.append({
                    "id": provider.id,
                    "name": provider.name,
                    "info": provider.contact_info,
                })

            return make_response(jsonify({"data": providers_list}), 200)

    def post(self):
        """
        Creates a new provider.
        """
        data = request.get_json()
        if not data:
            return make_response(jsonify({'error': 'Invalid data'}), 400)

        name = data.get('name')
        contact_info = data.get('contactInfo')

        if not name or not contact_info:
            return make_response(jsonify({'error': 'Name and contactInfo are required'}), 400)

        try:
            new_provider = Provider(name=name, contact_info=contact_info)
            db.session.add(new_provider)
            db.session.commit()
            return make_response(jsonify(new_provider.to_dict()), 201)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': str(e)}), 500)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "contact_info": self.contact_info
        }


api.add_resource(ProvidersResource, "/api/providers",
                 '/api/providers/<int:provider_id>')


@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_details(user_id):
    user = db.session.get(User, user_id)

    if user:
        # Serialize cosmetics to a list of dictionaries
        cosmetics_list = [
            {
                'id': cosmetic.id,
                'name': cosmetic.name,
                'brand': cosmetic.brand,
            }
            for cosmetic in user.cosmetics
        ]

        user_data = {
            'username': user.username,
            'email': user.email,
            'cosmetics': cosmetics_list,
        }
        return make_response(jsonify(user_data), 200)
    else:
        return make_response(jsonify({'error': 'User not found'}), 404)


class CategoryResource(Resource):
    def get(self, category_id):
        """
        Retrieves category details, including name and a list of cosmetics with notes.

        Args:
            category_id (int): The ID of the category to retrieve.

        Returns:
            JSON response: Category details or an error message.
        """
        category = db.session.get(Category, category_id)

        if category:
            # Fetch cosmetics associated with the category using the association table
            cosmetics_list = []
            user_id = session.get('user_id')
            for cosmetic_category in CosmeticCategory.query.filter_by(category_id=category_id).all():
                cosmetic = db.session.get(
                    Cosmetic, cosmetic_category.cosmetic_id)
                if cosmetic:
                    if cosmetic.user_id == user_id:
                        cosmetics_list.append({
                            'id': cosmetic.id,
                            'name': cosmetic.name,
                            'brand': cosmetic.brand,
                            'note': cosmetic_category.notes,
                        })

            category_data = {
                'name': category.name,
                'cosmetics': cosmetics_list,
            }
            return make_response(jsonify(category_data), 200)
        else:
            return make_response(jsonify({'error': 'Category not found'}), 404)

    def post(self):
        """
        Creates a new category.
        """
        data = request.get_json()
        if not data:
            return make_response(jsonify({'error': 'Invalid data'}), 400)

        name = data.get('name')

        if not name:
            return make_response(jsonify({'error': 'Name is required'}), 400)

        try:
            new_category = Category(name=name)
            db.session.add(new_category)
            db.session.commit()
            return make_response(jsonify(new_category.to_dict()), 201)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': str(e)}), 500)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }


api.add_resource(CategoryResource, '/api/category',
                 '/api/categories/<int:category_id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
