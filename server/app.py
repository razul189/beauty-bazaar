#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, session, abort
from flask_restful import Resource 

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Category, Cosmetic

@app.route('/')
def index():
    return "<h1>Beauty Bazaar Server</h1>"

#  User Authentication Endpoints 
class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return {"error": "Username, email, and password are required."}, 400
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return new_user.to_dict(), 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {"error": "Invalid username or password"}, 401

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            return user.to_dict(), 200
        abort(401, description="Not logged in")

class Logout(Resource):
    def delete(self):
        session.clear()
        return {"message": "Logged out successfully"}, 204

api.add_resource(Signup, "/api/signup")
api.add_resource(Login, "/api/login")
api.add_resource(CheckSession, "/api/check_session")
api.add_resource(Logout, "/api/logout")

# (Full CRUD for Cosmetic as the join model)
class CosmeticsResource(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            cosmetics = Cosmetic.query.filter_by(user_id=user_id).all()
        else:
            cosmetics = []
        return jsonify([cosmetic.to_dict() for cosmetic in cosmetics]), 200

    def post(self):
        data = request.get_json()
        try:
            new_cosmetic = Cosmetic(
                name=data['name'],
                brand=data.get('brand', ''),
                description=data.get('description', ''),
                price=data.get('price', 0.0),
                user_id=session.get('user_id'),      # Cosmetic belongs to the logged-in user
                category_id=data['category_id']       # Must supply a valid category_id
            )
            db.session.add(new_cosmetic)
            db.session.commit()
            return new_cosmetic.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class CosmeticResource(Resource):
    def get(self, id):
        cosmetic = Cosmetic.query.get(id)
        if cosmetic:
            return cosmetic.to_dict(), 200
        abort(404, "Cosmetic not found")

    def patch(self, id):
        cosmetic = Cosmetic.query.get(id)
        if not cosmetic:
            abort(404, "Cosmetic not found")
        data = request.get_json()
        if 'name' in data:
            cosmetic.name = data['name']
        if 'brand' in data:
            cosmetic.brand = data['brand']
        if 'description' in data:
            cosmetic.description = data['description']
        if 'price' in data:
            cosmetic.price = data['price']
        if 'category_id' in data:
            cosmetic.category_id = data['category_id']
        db.session.commit()
        return cosmetic.to_dict(), 200

    def delete(self, id):
        cosmetic = Cosmetic.query.get(id)
        if not cosmetic:
            abort(404, "Cosmetic not found")
        db.session.delete(cosmetic)
        db.session.commit()
        return {"message": "Cosmetic deleted"}, 204

api.add_resource(CosmeticsResource, "/api/cosmetics")
api.add_resource(CosmeticResource, "/api/cosmetics/<int:id>")

# --- Users Endpoints (Create and Read) ---
class UsersResource(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return users, 200

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
            return new_user.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

api.add_resource(UsersResource, "/api/users")


@app.route('/categories', methods=['GET'])
def get_categories():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify([]), 200
    cosmetics = Cosmetic.query.filter_by(user_id=user_id).all()
    categories = {}
    for cosmetic in cosmetics:
        cat = cosmetic.category.to_dict()
        categories[cat['id']] = cat
    return jsonify(list(categories.values())), 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)
