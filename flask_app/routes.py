from flask import current_app as app
from flask import render_template, redirect, request, jsonify
from .utils.database.database  import database
from pprint import pprint
import json
import random
import os
db = database()
from werkzeug.utils import secure_filename

@app.route('/')
def root():
	return render_template('index.html')

@app.route('/test')
def test():
	return jsonify(test = "test ajax call")

@app.route('/upload-video', methods=['POST'])
def upload_video():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.root_path, 'static', 'main', 'videos', filename)
        file.save(save_path)
        return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200