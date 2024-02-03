from flask import current_app as app
from flask import render_template, redirect, request, jsonify, send_from_directory,abort
from .utils.database.database  import database
from pprint import pprint
import json
import random
import os
db = database()
from werkzeug.utils import secure_filename
# computer vision
from flask_app.video_analysis import deploy_cvision_tools
from flask_app.brand_detection.logo import LogoDetector
# firebase auth
import firebase_admin
import firebase_admin.auth as auth
import firebase_admin.credentials as credentials
    
ANNOTATED_IMAGES_FOLDER = os.path.join(app.root_path, 'static', 'main', 'annotated_images')

@app.route('/')
def root():
	return render_template('index.html')

@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

@app.route('/test')
def test():
	return jsonify(test = "test ajax call")


@app.route('/annotated_images/<path:filename>')
def annotated_images(filename):
    if filename.endswith('.DS_Store'):
        # If the requested file is a .DS_Store file, return a 404 Not Found error
        abort(404)
    else:
        # Otherwise, serve the requested file from the annotated images folder
        return send_from_directory(ANNOTATED_IMAGES_FOLDER, filename)



@app.route('/get-first-annotated-image')
def get_annotated_images():
    annotated_images_folder = os.path.join(app.root_path, 'static', 'main', 'annotated_images')
    annotated_images = os.listdir(annotated_images_folder)

    # Filter out .DS_Store file if present
    annotated_images = [filename for filename in annotated_images if filename != '.DS_Store']

    return jsonify({'images': annotated_images})


@app.route('/upload-video', methods=['POST'])
def upload_video():
    #FOR OTHER FORM INPUT
    name = request.form['name']
    print("name: ", name)
    dealership = request.form['dealership']
    print("dealership", dealership)
    department = request.form['department']
    print("department", department)
    country = request.form['country']
    print("country", country)

    #FOR VIDEO ANALYSIS
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
    
# checks if a user is an admin
@app.route('/check-admin', methods=['POST'])
def check_admin():
    # initialize
    path = os.path.join(app.root_path, 'static', 'main', 'config', 'test-99d52-firebase-adminsdk-1nugx-736f004ccf.json')
    cred = credentials.Certificate(path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    # list of admins
    admin = ["admin@email.com"]
    # get the user token
    token = request.json.get('userToken')
    #decode the token
    decoded_token = auth.verify_id_token(token)
    user_email = decoded_token['email']

    # check if the current user is an admin
    if user_email in admin:
        return jsonify({'isAdmin': True}), 200

    return jsonify({'isAdmin': False}), 200



            
    