from flask import current_app as app
from flask import render_template, redirect, request, jsonify
from .utils.database.database  import database
from pprint import pprint
import json
import random
import os
db = database()
from werkzeug.utils import secure_filename
from flask_app.video_analysis import deploy_cvision_tools
from flask_app.brand_detection.logo import LogoDetector

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
        save_path = os.path.join(app.root_path, 'static', 'main', 'media', filename)
        file.save(save_path)
        try:
            logo_detector = LogoDetector()

            # Analyse the uploaded video and delete it after
            logo_detector.detect_logos_image(save_path)
            deploy_cvision_tools(save_path) 
            if os.path.exists(save_path):
                # Delete the video after analysing it
                os.remove(save_path)
            return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200
        except Exception as e:
                error_message = f"Error during detection: {str(e)}"
                print(error_message)
                return jsonify({'error': error_message}), 500
    else:
        return jsonify({'error': 'Unsupported file format'}), 400

            
    