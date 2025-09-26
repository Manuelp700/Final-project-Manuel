import click
from .models import db, User, Product, Cart, CartItem

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def setup_commands(app):
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

    @app.cli.command("insert-sample-products")
    def insert_sample_products():
        samples = [
            {"name": "Billie Eilish Hoodie Black", "description": "Sudadera oficial negra.",
                "price": 49.99, "stock": 50, "image_url": "https://picsum.photos/seed/b1/600/400"},
            {"name": "Billie Eilish Cap Neon", "description": "Gorra neón edición fan.",
                "price": 19.99, "stock": 80, "image_url": "https://picsum.photos/seed/b2/600/400"},
            {"name": "Ariana Grande T-Shirt Pink", "description": "Camiseta rosa tour.",
                "price": 24.99, "stock": 100, "image_url": "https://picsum.photos/seed/a1/600/400"},
            {"name": "Ariana Grande Hoodie Cream", "description": "Sudadera crema.",
                "price": 54.99, "stock": 40, "image_url": "https://picsum.photos/seed/a2/600/400"},
            {"name": "Lady Gaga Cap Chromatica", "description": "Gorra edición Chromatica.",
                "price": 21.99, "stock": 60, "image_url": "https://picsum.photos/seed/g1/600/400"},
            {"name": "Lady Gaga T-Shirt Black", "description": "Camiseta negra logo.",
                "price": 22.50, "stock": 90, "image_url": "https://picsum.photos/seed/g2/600/400"},
            {"name": "Billie Eilish Beanie", "description": "Gorro de lana verde.",
                "price": 16.99, "stock": 70, "image_url": "https://picsum.photos/seed/b3/600/400"},
            {"name": "Ariana Grande Tote Bag", "description": "Bolsa de tela.", "price": 12.99,
                "stock": 120, "image_url": "https://picsum.photos/seed/a3/600/400"},
            {"name": "Lady Gaga Poster Limited", "description": "Póster edición limitada.",
                "price": 14.99, "stock": 30, "image_url": "https://picsum.photos/seed/g3/600/400"},
            {"name": "Billie Eilish Socks", "description": "Calcetines temáticos.",
                "price": 9.99, "stock": 150, "image_url": "https://picsum.photos/seed/b4/600/400"},
            {"name": "Ariana Grande Phone Case", "description": "Funda móvil.", "price": 17.99,
                "stock": 100, "image_url": "https://picsum.photos/seed/a4/600/400"},
            {"name": "Lady Gaga Hoodie Pink", "description": "Sudadera rosa vibrante.",
                "price": 52.00, "stock": 35, "image_url": "https://picsum.photos/seed/g4/600/400"},
            {"name": "Billie Eilish Necklace", "description": "Collar logo.", "price": 18.50,
                "stock": 75, "image_url": "https://picsum.photos/seed/b5/600/400"},
            {"name": "Ariana Grande Cap White", "description": "Gorra blanca.", "price": 19.50,
                "stock": 85, "image_url": "https://picsum.photos/seed/a5/600/400"},
            {"name": "Lady Gaga T-Shirt White", "description": "Camiseta blanca.",
                "price": 23.99, "stock": 95, "image_url": "https://picsum.photos/seed/g5/600/400"},
            {"name": "Billie Eilish Bracelet", "description": "Pulsera oficial.", "price": 11.99,
                "stock": 110, "image_url": "https://picsum.photos/seed/b6/600/400"},
            {"name": "Ariana Grande Hoodie Lilac", "description": "Sudadera lila.",
                "price": 55.00, "stock": 45, "image_url": "https://picsum.photos/seed/a6/600/400"},
            {"name": "Lady Gaga Cap Black", "description": "Gorra negra.", "price": 20.00,
                "stock": 70, "image_url": "https://picsum.photos/seed/g6/600/400"},
            {"name": "Billie Eilish Poster Neon", "description": "Póster neón.", "price": 13.50,
                "stock": 65, "image_url": "https://picsum.photos/seed/b7/600/400"},
            {"name": "Ariana Grande Beanie Pink", "description": "Gorro rosa.", "price": 15.50,
                "stock": 60, "image_url": "https://picsum.photos/seed/a7/600/400"},
        ]
        created = 0
        for s in samples:
            if not Product.query.filter_by(name=s["name"]).first():
                p = Product(**s)
                db.session.add(p)
                created += 1
        db.session.commit()
        print(f"Productos creados: {created}")
