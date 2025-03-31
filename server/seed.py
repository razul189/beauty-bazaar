#!/usr/bin/env python3

from faker import Faker
from random import choice, randint
from app import app
from config import db
from models import User, Category, Cosmetic, user_categories

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Seeding database...")

        # Clear existing data
        Cosmetic.query.delete()
        Category.query.delete()
        db.session.query(user_categories).delete()
        db.session.commit()
