#!/usr/bin/env python3

#  Imports
from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from sqlalchemy import exists
from models import User, Category, Cosmetic, user_categories
from sqlalchemy import select, update, delete

# Session Check


class CheckSession(Resource):
    def get(self):
        print("user", )
        session.get('user_id')
        if session.get('user_id'):
            user = User.query.get(session['user_id'])
            print("user", user)
            if user:
                user_dict = {
                    "id": user.id,
                    "username": user.username,
                    "categories": []
                }
                categories = []
                print("user.categories", user.categories)
                for category in user.categories:
                    print("category", category)
                    cosmetics = [
                        cosmetic.to_dict(rules=('-category',))
                        for cosmetic in category.cosmetics
                        if cosmetic.user_id == user.id
                    ]
                    print("cosmetics", cosmetics)
                    if cosmetics:  # Only add category if it has cosmetics for the user
                        category_data = category.to_dict()
                        category_data['cosmetics'] = cosmetics
                        categories.append(category_data)

                user_dict = user.to_dict()
                user_dict['categories'] = categories
                all_categories = Category.query.all()
                all_categories = [category.to_dict()
                                  for category in all_categories]
                user_dict["all_categories"] = all_categories
                return user_dict, 200
            else:
                return {}, 204
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
            user_dict = {
                "id": user.id,
                "username": user.username,
                "categories": []
            }
            all_categories = Category.query.all()
            all_categories = [category.to_dict()
                              for category in all_categories]
            user_dict["all_categories"] = all_categories
            return user_dict, 201
        return {'error': 'Missing credentials'}, 422


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.authenticate(data.get('password')):
            session['user_id'] = user.id
            user_dict = {
                "id": user.id,
                "username": user.username,
                "categories": []
            }
            # Iterate over the user's categories
            for category in user.categories:
                # Filter cosmetics to include ONLY the current user's cosmetics
                filtered_cosmetics = [
                    cosmetic.to_dict(rules=('-category', '-user_id'))
                    for cosmetic in category.cosmetics
                    if cosmetic.user_id == user.id
                ]
                # Only include the category if it has the user's cosmetics
                if filtered_cosmetics:  # Skip categories with no user cosmetics
                    category_dict = category.to_dict(
                        rules=('-users', '-cosmetics'))
                    category_dict["cosmetics"] = filtered_cosmetics
                    user_dict["categories"].append(category_dict)
            all_categories = Category.query.all()
            all_categories = [category.to_dict()
                              for category in all_categories]
            user_dict["all_categories"] = all_categories
            return user_dict, 200
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
            category_id = data['category_id']
            # Check if user and category exist
            user = User.query.get(user_id)
            category = Category.query.get(category_id)

            if not user or not category:
                return {'error': 'User or Category not found'}, 404

            # Create the association record
            cosmetic = Cosmetic(

                title=data['title'],

                description=data.get('description'),

                category_id=data['category_id'],

                user_id=user_id

            )

            db.session.add(cosmetic)
            db.session.commit()
            if category not in user.categories:
                user.categories.append(category)
                db.session.commit()
            return cosmetic.to_dict(), 201

        except KeyError as e:
            return {'error': f'Missing required field: {e}'}, 400
        except Exception as e:
            print("e", e)
            return {'error': str(e)}, 422


class CosmeticByID(Resource):
    def patch(self, id):
        user_id = session.get('user_id')
        cosmetic = Cosmetic.query.get(id)
        if cosmetic and cosmetic.user_id == user_id:
            data = request.get_json()
            for attr in ['title', 'description', 'category_id']:
                setattr(cosmetic, attr, data.get(
                    attr, getattr(cosmetic, attr)))
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
    def get(self, category_id=False):
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

api.add_resource(Categories, '/categories',
                 "/categories/<int:category_id>")


if __name__ == '__main__':
    app.run(port=5555, debug=True)
