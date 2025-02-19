from sqlalchemy_serializer import SerializerMixin
# from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    # One-to-many: A user has many cosmetics.
    cosmetics = db.relationship('Cosmetic', backref='user', lazy=True)

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    # One-to-many: A category has many cosmetics.
    cosmetics = db.relationship('Cosmetic', backref='category', lazy=True)

class Cosmetic(db.Model, SerializerMixin):
    __tablename__ = 'cosmetics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    brand = db.Column(db.String)
    description = db.Column(db.String)
    price = db.Column(db.Float)
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    # Exclude recursive data in serialization:
    serialize_rules = ("-user.cosmetics", "-category.cosmetics")

