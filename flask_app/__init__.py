#--------------------------------------------------
# Import Requirements
#--------------------------------------------------
import os
from flask import Flask
from flask_cors import CORS
from flask_failsafe import failsafe

#--------------------------------------------------
# Create a Failsafe Web Application
#--------------------------------------------------
@failsafe
def create_app():
	# change the static and template folders of flask to the react build files
	app = Flask(__name__, static_url_path='',
                  static_folder='../react_app/build',
                  template_folder='../react_app/build')
	CORS(app)
	
	from .utils.database.database import database
	db = database()
	db.createTables(purge=True)

	with app.app_context():
		from . import routes
		return app
