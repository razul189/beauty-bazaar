# models.py file
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from extensions import db
from sqlalchemy.orm import validates

# Association table for Cosmetic-Category (Many-to-Many) with a user-submittable field


class CosmeticCategory(db.Model):
    __tablename__ = 'cosmetic_category'
    cosmetic_id = db.Column(db.Integer, db.ForeignKey(
        'cosmetics.id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey(
        'categories.id'), primary_key=True)
    # User-submittable field: notes
    notes = db.Column(db.String, nullable=True)

# Provider model (One-to-Many with Cosmetic)


class Provider(db.Model, SerializerMixin):
    __tablename__ = 'providers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    contact_info = db.Column(db.String)

    # One-to-Many relationship with Cosmetics
    cosmetics = db.relationship('Cosmetic', backref='provider', lazy=True)


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)

    # One-to-Many: A user can own multiple cosmetics
    cosmetics = db.relationship('Cosmetic', backref='user', lazy=True)

    def authenticate(self, password):
        return self.password == password


class Cosmetic(db.Model, SerializerMixin):
    __tablename__ = 'cosmetics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    brand = db.Column(db.String)
    description = db.Column(db.String)
    price = db.Column(db.Float)

    # One-to-Many: Each cosmetic belongs to one provider
    provider_id = db.Column(db.Integer, db.ForeignKey(
        'providers.id'), nullable=True)

    # One-to-Many: Each cosmetic belongs to one user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Many-to-Many with Categories 
    categories = db.relationship(
        'Category', secondary='cosmetic_category', backref='cosmetics')
    
    @validates('name') 
    def validate_name(self, key, value): 
        if not value: raise ValueError("Cosmetic name cannot be empty.") 
        if len(value) < 2: raise ValueError("Cosmetic name must be at least 2 characters long.") 
        return value



class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
