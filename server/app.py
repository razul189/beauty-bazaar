#!/usr/bin/env python3
from flask import request, make_response, session, abort
from flask_restful import Resource
from config import app, db, api
from models import User, Cosmetic, Category

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
            new_user = User(username=username, email=email)
            new_user.password = password
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 201)
        return make_response({"error": "Missing required fields"}, 400)

api.add_resource(Signup, "/api/signup")

class Login(Resource):
    def post(self):
        json_data = request.get_json()
        username = json_data.get('username')
        password = json_data.get('password')
        user = User.query.filter_by(username=username).first()
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)
        return make_response({"error": "Invalid username or password"}, 401)

api.add_resource(Login, "/api/login")

class CheckSession(Resource):
    def get(self):
        try:
            user = User.query.filter_by(id=session.get('user_id')).first()
            if user:
                return make_response(user.to_dict(), 200)
            abort(401, "Please log in")
        except:
            abort(401, "Please log in")

api.add_resource(CheckSession, "/http://localhost:5555/api/check_session/")

class Logout(Resource):
    def delete(self):
        session.clear()
        return make_response('', 204)

api.add_resource(Logout, "/api/logout")

# --- Cosmetics Endpoints ---
class CosmeticsResource(Resource):
    def get(self):
        user_id = session.get('user_id')
        cosmetics = Cosmetic.query.filter_by(user_id=user_id).all() if user_id else []
        return make_response([c.to_dict() for c in cosmetics], 200)

    def post(self):
        data = request.get_json()
        try:
            new_cosmetic = Cosmetic(
                name=data['name'],
                brand=data.get('brand', ''),
                description=data.get('description', ''),
                price=data.get('price', 0.0),
                user_id=session.get('user_id'),
                category_id=data['category_id']
            )
            db.session.add(new_cosmetic)
            db.session.commit()
            return make_response(new_cosmetic.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 400)

api.add_resource(CosmeticsResource, "/api/cosmetics")

# --- Users Endpoints ---
class UsersResource(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)

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
@app.route('/api/my_categories', methods=['GET'])
def get_categories():
    user_id = session.get('user_id')
    print("DEBUG: User ID in session:", user_id)
    if not user_id:
        return make_response([], 200)
    cosmetics = Cosmetic.query.filter_by(user_id=user_id).all()
    print("DEBUG: Cosmetics fetched for user:", cosmetics)
    categories = {}
    for cosmetic in cosmetics:
        if cosmetic.category:
            cat = cosmetic.category.to_dict()
            categories[cat['id']] = cat
    result = list(categories.values())
    print("DEBUG: Categories computed:", result)
    return make_response(list(categories.values()), 200)

if __name__ == '__main__':
    app.run(port=5555, debug=True)

class MyCategories(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Not logged in"}, 401

        # Get cosmetics for the logged in user
        cosmetics = Cosmetic.query.filter_by(user_id=user_id).all()
        # Use a dictionary to ensure uniqueness
        categories_dict = {}
        for cosmetic in cosmetics:
            if cosmetic.category:  # Ensure that the cosmetic has a related category
                categories_dict[cosmetic.category.id] = cosmetic.category.to_dict()
        return list(categories_dict.values()), 200

api.add_resource(MyCategories, "/api/my_categories")







