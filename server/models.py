# models.py file
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, func
from sqlalchemy.orm import relationship, backref
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime, Float, Table, Boolean

from config import db, bcrypt

# Association table with an additional field
user_categories = db.Table('user_categories',
                           db.Column('user_id', db.Integer, db.ForeignKey(
                               'users.id'), primary_key=True),
                           db.Column('category_id', db.Integer, db.ForeignKey(
                               'categories.id'), primary_key=True),
                           db.Column('is_favorite', db.Boolean,
                                     default=False)  # Added field
                           )


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-categories.users',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String)

    categories = db.relationship(
        'Category', secondary=user_categories, backref='users', lazy='dynamic')

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'User(id={self.id}, username={self.username})'


class Cosmetic(db.Model, SerializerMixin):
    __tablename__ = 'cosmetics'

    serialize_rules = ('-user.cosmetics', '-category.cosmetics',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(
        'categories.id'), nullable=False)

    def __repr__(self):
        return f'Cosmetic(id={self.id}, title={self.title}, ' + \
            f'description={self.description}, user_id={self.user_id}, ' + \
            f'category_id={self.category_id})'


class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    serialize_rules = ('-users.categories',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)

    cosmetics = db.relationship('Cosmetic', backref='category', lazy=True)

    def __repr__(self):
        return f'Category(id={self.id}, name={self.name})'
