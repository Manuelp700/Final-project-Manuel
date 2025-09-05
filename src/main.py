import os
from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from api.models import db
from api.routes import api


def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-me')

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    app.register_blueprint(api, url_prefix='/api')
    return app


app = create_app()

if __name__ == "__main__":
    app.run()
