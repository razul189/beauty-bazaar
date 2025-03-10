#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Category, Cosmetic, Provider, CosmeticCategory
from datetime import datetime


if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        # Reset the database
        db.drop_all()
        db.create_all()

        # Create sample users
        user1 = User(username="makeupLover",
                     email="makeupLover@example.com", password="password123")
        user2 = User(username="beautyGuru",
                     email="beautyGuru@example.com", password="password456")

        # Create sample providers
        provider1 = Provider(
            name="BeautyCo", contact_info="contact@beautyco.com")
        provider2 = Provider(name="SkinCare Inc.",
                             contact_info="info@skincare.com")

        # Create sample categories
        category1 = Category(name="Skincare")
        category2 = Category(name="Makeup")
        category3 = Category(name="Haircare")

        # Add users, providers, and categories to the session first
        db.session.add_all(
            [user1, user2, provider1, provider2, category1, category2, category3])
        db.session.commit()  # Commit so we can access IDs

        # Create sample cosmetics
        cosmetic1 = Cosmetic(
            name="Moisturizer",
            brand="Nivea",
            description="Hydrating daily moisturizer",
            price=12.99,
            provider_id=provider1.id,  # Use assigned ID
            user_id=user1.id  # Use assigned ID
        )

        cosmetic2 = Cosmetic(
            name="Lipstick",
            brand="MAC",
            description="Matte red lipstick",
            price=19.99,
            provider_id=provider2.id,
            user_id=user1.id
        )

        cosmetic3 = Cosmetic(
            name="Shampoo",
            brand="Head & Shoulders",
            description="Anti-dandruff shampoo",
            price=8.99,
            provider_id=provider2.id,
            user_id=user2.id
        )

        # Add cosmetics to the session and commit
        db.session.add_all([cosmetic1, cosmetic2, cosmetic3])
        db.session.commit()  # Commit so we can access cosmetic IDs

        # Create associations between cosmetics and categories
        cosmetic_category1 = CosmeticCategory(
            cosmetic_id=cosmetic1.id,  # Now IDs exist
            category_id=category1.id,
            notes="Great for dry skin."
        )

        cosmetic_category2 = CosmeticCategory(
            cosmetic_id=cosmetic2.id,
            category_id=category2.id,
            notes="Perfect for evening wear."
        )

        cosmetic_category3 = CosmeticCategory(
            cosmetic_id=cosmetic3.id,
            category_id=category3.id,
            notes="Effective against dandruff."
        )

        # Add cosmetic-category relationships and commit
        db.session.add_all(
            [cosmetic_category1, cosmetic_category2, cosmetic_category3])
        db.session.commit()

        print("Database successfully populated with sample data!")
