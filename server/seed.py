#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Category, Cosmetic

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        
        # Create some users (only if they don't already exist)
        if not User.query.first():
            user1 = User(username="makeupLover", email="makeupLover@example.com", password="password123")
            user2 = User(username="beautyGuru", email="beautyGuru@example.com", password="password456")
            db.session.add_all([user1, user2])
            db.session.commit()

        # Create some categories
        if not Category.query.first():
            cat1 = Category(name="Lipsticks")
            cat2 = Category(name="Foundations")
            cat3 = Category(name="Mascara")
            db.session.add_all([cat1, cat2, cat3])
            db.session.commit()

        # Create cosmetics if they don't already exist
        if not Cosmetic.query.first():
            user1 = User.query.filter_by(username="makeupLover").first()
            cat1 = Category.query.filter_by(name="Lipsticks").first()
            cat2 = Category.query.filter_by(name="Foundations").first()
            cat3 = Category.query.filter_by(name="Mascara").first()

            cosmetic1 = Cosmetic(
                name="Radiant Rouge Lipstick",
                brand=fake.company(),
                description=fake.sentence(),
                price=19.99,
                user_id=user1.id,
                category_id=cat1.id
            )
            cosmetic2 = Cosmetic(
                name="Silky Smooth Foundation",
                brand=fake.company(),
                description=fake.sentence(),
                price=29.99,
                user_id=user1.id,
                category_id=cat2.id
            )
            cosmetic3 = Cosmetic(
                name="Mega Volume Mascara",
                brand=fake.company(),
                description=fake.sentence(),
                price=14.99,
                user_id=user1.id,
                category_id=cat3.id
            )
            db.session.add_all([cosmetic1, cosmetic2, cosmetic3])
            db.session.commit()

        print("Database seeded!")
