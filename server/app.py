#!/usr/bin/env python3

#  Imports
from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import User, Category, Cosmetic

# Session Check
class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()

            # get only the categories where the user has cosmetics
            user_categories = list({c.category for c in user.cosmetics})

            return {
                "id": user.id,
                "username": user.username,
                "categories": [cat.to_dict() for cat in user_categories]
            }, 200

        return {}, 204


#  Auth
class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = User(username=username)
            user.password_hash = password
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return user.to_dict(), 201
        return {'error': 'Missing credentials'}, 422

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.authenticate(data.get('password')):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {'error': 'Invalid login'}, 401

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204

#  Cosmetics
class Cosmetics(Resource):
    def get(self):
        return [cosmetic.to_dict() for cosmetic in Cosmetic.query.all()], 200

    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        data = request.get_json()
        try:
            cosmetic = Cosmetic(
                title=data['title'],
                description=data.get('description'),
                note=data.get('note'),
                category_id=data['category_id'],
                user_id=user_id
            )
            db.session.add(cosmetic)
            db.session.commit()
            return cosmetic.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 422

class CosmeticByID(Resource):
    def patch(self, id):
        user_id = session.get('user_id')
        cosmetic = Cosmetic.query.get(id)
        if cosmetic and cosmetic.user_id == user_id:
            data = request.get_json()
            for attr in ['title', 'description', 'note', 'category_id']:
                setattr(cosmetic, attr, data.get(attr, getattr(cosmetic, attr)))
            db.session.commit()
            return cosmetic.to_dict(), 200
        return {'error': 'Unauthorized'}, 401

    def delete(self, id):
        user_id = session.get('user_id')
        cosmetic = Cosmetic.query.get(id)
        if cosmetic and cosmetic.user_id == user_id:
            db.session.delete(cosmetic)
            db.session.commit()
            return {'message': 'Deleted'}, 200
        return {'error': 'Unauthorized'}, 401

#  Categories
class Categories(Resource):
    def get(self):
        # ✅ Return all categories (unfiltered, general list)
        categories = Category.query.all()
        return [category.to_dict() for category in categories], 200

    def post(self):
        if session.get("user_id"):
            data = request.get_json()
            name = data.get("name")

            if not name or len(name.strip()) < 2:
                return {"error": "Category name is required."}, 400

            try:
                category = Category(name=name.strip())

                db.session.add(category)
                db.session.commit()

                return category.to_dict(), 201

            except IntegrityError:
                db.session.rollback()
                return {"error": "Category already exists or invalid."}, 422

        return {"error": "Unauthorized"}, 401



#  API Routes
api.add_resource(CheckSession, '/check_session')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

api.add_resource(Cosmetics, '/cosmetics')
api.add_resource(CosmeticByID, '/cosmetics/<int:id>')

api.add_resource(Categories, '/categories')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
