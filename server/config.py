from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from sqlalchemy import MetaData
import os


app = Flask(__name__)


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "app")
SQLALCHEMY_DATABASE_URI = f'sqlite:///{DB_PATH}.db'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'  # Stores session data in files
app.config['SESSION_PERMANENT'] = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
migrate = Migrate(app, db)

# CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

api = Api(app)
