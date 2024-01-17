from flask import current_app as app
from flask import render_template, redirect, request, jsonify
from .utils.database.database  import database
from pprint import pprint
import json
import random
db = database()

@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	return render_template('index.html')

@app.route('/test')
def test():
	return jsonify(test = "test ajax call")