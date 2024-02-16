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
from flask_app.video_analysis import count_cars_in_footage, assess_hospitality, count_parking_spaces
from flask_app.brand_detection.logo import LogoDetector
from flask_app.computer_vision.square_footage_detector import compute_square_footage
# firebase auth
import firebase_admin
import firebase_admin.auth as auth
from firebase_admin import credentials, storage, firestore
from datetime import datetime
    
ANNOTATED_IMAGES_FOLDER = os.path.join(app.root_path, 'static', 'main', 'annotated_images')

bucket = storage.bucket()

@app.route('/')
def root():
	return render_template('index.html')

@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

@app.route('/test')
def test():
	return jsonify(test = "test ajax call")

@app.route('/get-annotated-images')
def get_annotated_images():
    try:
        # Fetch annotated images from Firebase Storage and return their URLs
        blobs = bucket.list_blobs(prefix='annotated_images/')
        
        # Extract public URLs of the annotated images only if it is a png (It will grab the folder as well if not)
        image_urls = [blob.public_url for blob in blobs if os.path.splitext(blob.name)[1] == '.png']

        return jsonify({'images': image_urls}), 200
    except Exception as e:
        # Handle any errors that occur during image retrieval
        error_message = f"Error fetching annotated images: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500


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

    # we should save the folders from each dealership somewhere in here
    database_info = [request.form['name'], request.form['dealership'], request.form['department'], request.form['country']]

    #FOR VIDEO ANALYSIS

    # spatial files in list
    spatial_files = []
    index = 0
    while f'spatial[{index}]' in request.files:
        file = request.files[f'spatial[{index}]']
        spatial_files.append(file)
        index += 1
    print("spatial files;", spatial_files)

    # add the spatial awareness here. the files are stored in list spatial_files

    # loop the detection categories
    required_categories = ['logo', 'hospitality', 'parking', 'cars']

    # logic for extracting file from different categories (works for multi files)
    for category in required_categories:
        files_list = []
        index = 0
        # gonna loop through all files and put it in a list
        while f'{category}[{index}]' in request.files:
            file = request.files[f'{category}[{index}]']
            files_list.append(file)
            index += 1

        # process files in the list
        for file in files_list:
            try:
                filename = secure_filename(file.filename)
                save_path = os.path.join(app.root_path, 'static', 'main', 'media', filename)
                file.save(save_path)

                if category == 'logo':
                    logo_detector = LogoDetector()
                    logo_detector.detect_logos_image(save_path)
                elif category == 'hospitality':
                    assess_hospitality(save_path)
                elif category == 'parking':
                    count_parking_spaces(save_path)
                elif category == 'cars':
                    count_cars_in_footage(save_path)

                if os.path.exists(save_path):
                    os.remove(save_path)

            except Exception as e:
                error_message = f"Error during {category} processing: {str(e)}"
                print(error_message)
                return jsonify({'error': error_message}), 500
                  
    # add the form info to the database
    add_to_database(database_info)
    return jsonify({'message': 'Files uploaded and processed successfully'}), 200

# checks if a user is an admin
@app.route('/check-admin', methods=['POST'])
def check_admin():
    # initialize
    path = os.path.join(app.root_path, 'static', 'main', 'config', 'valued-range-411422-d36068bfa11f.json')
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

# push results from the database
def add_to_database(database_info):

     # firestore database
    db = firestore.client()

    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # append the new data in the correct format for firebase
    data = {
        # add the submission date here
        "Submitted": time,
        "Dealership Name": database_info[0],
        "Brand": database_info[1],
        "Department": database_info[2],
        "Country": database_info[3],
    }

    # go to the collection, create a new document (dealership name), create a new collection with (department)
    db.collection("results").document(database_info[0]).collection(database_info[2]).document(time).set(data)

# pull results from the database
@app.route('/generate-results', methods=['POST'])
def generate_results():
    try:
        # firestore database
        db = firestore.client()
        
        # results collection
        collection = db.collection('results')

        # all of our results
        results = []
        for doc in collection.stream():
            # put in a dictionary
            result_dict = doc.to_dict()
            results.append(result_dict)

        # return results
        return jsonify(results), 200
    # handle errors
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/audit/results/<dealership>/<year>')
def audit_results(dealership, year):
    # Here you can fetch data based on the dealership and year
    # For example, you can query your database for results related to the specified dealership and year
    # Assuming you have fetched data as a dictionary named 'results'
    results = {
        "dealership": dealership,
        "year": year,
        # Add other data fields as needed
    }
    # Return the data as JSON
    return jsonify(results)