from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, bcrypt
from flask import session

# -------------------
# USER
# -------------------
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    cosmetics = db.relationship('Cosmetic', back_populates='user', cascade='all, delete-orphan')

    # association proxy to get categories from cosmetics
    categories = association_proxy('cosmetics', 'category')

    @property
    def password_hash(self):
        raise AttributeError("Password hashes are not viewable.")

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username
        }

# -------------------
# CATEGORY
# -------------------
class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    cosmetics = db.relationship('Cosmetic', back_populates='category', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "cosmetics": [
                c.to_dict() for c in self.cosmetics if c.user_id == session.get("user_id")
            ]
        }

# -------------------
# COSMETIC
# -------------------
class Cosmetic(db.Model):
    __tablename__ = 'cosmetics'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    note = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))

    user = db.relationship('User', back_populates='cosmetics')
    category = db.relationship('Category', back_populates='cosmetics')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "note": self.note,
            "user_id": self.user_id,
            "category_id": self.category_id,
            "category": self.category.name if self.category else None
        }

    @validates('title')
    def validate_title(self, key, value):
        if not value or len(value.strip()) < 3:
            raise ValueError("Title must be at least 3 characters.")
        return value.strip()


