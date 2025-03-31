#!/usr/bin/env python3
# //app.py
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
        if session.get('user_id'):
            user = User.query.get(session['user_id'])
            if user:
                user_dict = {
                    "id": user.id,
                    "username": user.username,
                    "categories": []
                }
                # Fetch all user_category entries for the user to get is_favorite statuses
                user_cats = db.session.query(
                    user_categories.c.category_id,
                    user_categories.c.is_favorite
                ).filter(user_categories.c.user_id == user.id).all()
                # Create a dictionary mapping category IDs to their is_favorite status
                favorites_map = {
                    uc.category_id: uc.is_favorite for uc in user_cats}

                # Iterate over the user's categories
                for category in user.categories:
                    # Filter cosmetics to include ONLY the current user's cosmetics
                    filtered_cosmetics = [
                        cosmetic.to_dict(rules=('-category', '-user_id'))
                        for cosmetic in category.cosmetics
                        if cosmetic.user_id == user.id
                    ]
                    if filtered_cosmetics:  # Skip categories with no user cosmetics
                        category_dict = category.to_dict(
                            rules=('-users', '-cosmetics'))
                        # Add is_favorite status from the favorites_map, default to False
                        category_dict["is_favorite"] = favorites_map.get(
                            category.id, False)
                        category_dict["cosmetics"] = filtered_cosmetics
                        user_dict["categories"].append(category_dict)
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
            return user.to_dict(), 201
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
            # get is_favorite, or default to false.
            is_favorite = data.get('is_favorite', False)
            if is_favorite == 1:
                is_favorite = True
            else:
                is_favorite = False

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
            # Check if the association already exists
            association_exists = db.session.query(
                exists().where(
                    (user_categories.c.user_id == user_id) & (
                        user_categories.c.category_id == category_id)
                )
            ).scalar()

            if not association_exists:
                db.session.execute(
                    user_categories.insert().values(
                        user_id=user_id,
                        category_id=category_id,
                        is_favorite=is_favorite
                    )
                )
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

    def patch(self, category_id):
        # Authentication check
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401

        user_id = session['user_id']
        data = request.get_json()

        # Get the category
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404

        try:
            # Update category name if provided
            if 'name' in data:
                category.name = data['name']

            # Update is_favorite if provided
            if 'is_favorite' in data:
                # Check if association exists
                stmt = select(user_categories).where(
                    (user_categories.c.user_id == user_id) &
                    (user_categories.c.category_id == category_id)
                )
                association = db.session.execute(stmt).first()

                if not association:
                    return jsonify({'error': 'User not associated with category'}), 400

                # Update favorite status
                update_stmt = (
                    update(user_categories)
                    .where(
                        (user_categories.c.user_id == user_id) &
                        (user_categories.c.category_id == category_id)
                    )
                    .values(is_favorite=data['is_favorite'])
                )
                db.session.execute(update_stmt)
            db.session.commit()
            # Exclude unwanted relationships
            category_dict = category.to_dict(rules=('-users', '-cosmetics'))
            category_dict['is_favorite'] = data['is_favorite']
            cosmetics = Cosmetic.query.filter_by(
                user_id=user_id,
                category_id=category_id
            ).all()
            cosmetics_list = [cosmetic.to_dict() for cosmetic in cosmetics]
            category_dict["cosmetics"] = cosmetics_list
            return category_dict, 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    def delete(self, category_id):
        if not session.get('user_id'):
            return {"error": "Unauthorized"}, 401

        user = User.query.get(session['user_id'])
        if not user:
            return {"error": "User not found"}, 404

        category = Category.query.get(category_id)
        if not category:
            return {"error": "Category not found"}, 404

        try:
            # Delete user-category association
            db.session.execute(
                delete(user_categories)
                .where(
                    (user_categories.c.user_id == user.id) &
                    (user_categories.c.category_id == category_id)
                )
            )

            # Delete associated cosmetics
            Cosmetic.query.filter_by(
                user_id=user.id,
                category_id=category_id
            ).delete()

            db.session.commit()

            return {"message": "Category and associated data deleted"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": f"Error deleting data: {str(e)}"}, 500


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
