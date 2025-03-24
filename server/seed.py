#!/usr/bin/env python3

from faker import Faker
from random import choice, randint
from app import app
from config import db
from models import User, Category, Cosmetic

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Seeding database...")

        # Clear existing data
        Cosmetic.query.delete()
        Category.query.delete()
        User.query.delete()

        # Users
        users = []
        for _ in range(3):
            user = User(username=fake.user_name())
            user.password_hash = 'password'
            db.session.add(user)
            users.append(user)
        db.session.commit()
        print(f"Created {len(users)} users")

        # Categories
        category_names = ['Skincare', 'Makeup', 'Haircare', 'Fragrance']
        categories = []
        for name in category_names:
            c = Category(name=name)
            db.session.add(c)
            categories.append(c)
        db.session.commit()
        print(f"Created {len(categories)} categories")

        # Cosmetics
        for _ in range(15):
            cosmetic = Cosmetic(
                title=fake.catch_phrase(),
                description=fake.text(max_nb_chars=100),
                note=fake.sentence(nb_words=6),
                user_id=choice(users).id,
                category_id=choice(categories).id
            )
            db.session.add(cosmetic)
        db.session.commit()
        print("Created 15 cosmetics")

        print("Seeding complete!")

