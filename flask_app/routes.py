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

@app.route('/get-logo-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_annotated_images(brandName,dealershipName,department,submission):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/{department}/{submission}/LogoResults/'
        # Fetch annotated images from Firebase Storage and return their URLs
        blobs = bucket.list_blobs(prefix=folder_path)
        
        # Extract public URLs of the annotated images only if it is a png (It will grab the folder as well if not)
        image_urls = [blob.public_url for blob in blobs if os.path.splitext(blob.name)[1] == '.png']

        print("Length of URLS", len(image_urls))

        return jsonify({'images': image_urls}), 200
    except Exception as e:
        # Handle any errors that occur during image retrieval
        error_message = f"Error fetching annotated images: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500
    
@app.route('/get-car-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_annotated_images_car(brandName,dealershipName,department,submission):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/{department}/{submission}/CarResults/'
        # Fetch annotated images from Firebase Storage and return their URLs
        blobs = bucket.list_blobs(prefix=folder_path)
        
        # Extract public URLs of the annotated images only if it is a png (It will grab the folder as well if not)
        image_urls = [blob.public_url for blob in blobs if os.path.splitext(blob.name)[1] == '.png']

        return jsonify({'images': image_urls}), 200
    except Exception as e:
        # Handle any errors that occur during image retrieval
        error_message = f"Error fetching annotated images: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500

@app.route('/get-parking-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_annotated_images_parking(brandName,dealershipName,department,submission):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/{department}/{submission}/ParkingResults/'
        # Fetch annotated images from Firebase Storage and return their URLs
        blobs = bucket.list_blobs(prefix=folder_path)
        
        # Extract public URLs of the annotated images only if it is a png (It will grab the folder as well if not)
        image_urls = [blob.public_url for blob in blobs if os.path.splitext(blob.name)[1] == '.png']

        return jsonify({'images': image_urls}), 200
    except Exception as e:
        # Handle any errors that occur during image retrieval
        error_message = f"Error fetching annotated images: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500
    
@app.route('/get-hospitality-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_annotated_images_hospitality(brandName,dealershipName,department,submission):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/{department}/{submission}/HospitalityResults/'
        # Fetch annotated images from Firebase Storage and return their URLs
        blobs = bucket.list_blobs(prefix=folder_path)
        
        # Extract public URLs of the annotated images only if it is a png (It will grab the folder as well if not)
        image_urls = [blob.public_url for blob in blobs if os.path.splitext(blob.name)[1] == '.png']

        return jsonify({'images': image_urls}), 200
    except Exception as e:
        # Handle any errors that occur during image retrieval
        error_message = f"Error fetching annotated images: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500
    
@app.route('/get-spatial-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_annotated_images_spatial(brandName,dealershipName,department,submission):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/{department}/{submission}/SpatialResults/'
        # Fetch annotated images from Firebase Storage and return their URLs
        blobs = bucket.list_blobs(prefix=folder_path)
        
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
    dealershipName = request.form['name']
    print("Brand Name: ", dealershipName)
    brandName = request.form['dealership']
    print("dealership", brandName)
    department = request.form['department']
    print("department", department)
    country = request.form['country']
    print("country", country)
    submission = request.form['submission']
    print("submission",submission)

    # we should save the folders from each dealership somewhere in here
    database_info = [request.form['submission'],request.form['name'], request.form['dealership'], request.form['department'], request.form['country']]


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
                    filePath = f"{brandName}/{dealershipName}/{department}/{submission}/LogoResults"
                    logo_detector = LogoDetector(filePath=filePath)
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


    # append the new data in the correct format for firebase
    data = {
        # add the submission date here
        "Submitted": database_info[0],
        "Dealership Name": database_info[1],
        "Brand": database_info[2],
        "Department": database_info[3],
        "Country": database_info[4],
        #"Detection": # this would be like a nested list or something?
    }

    # go to the collection, create a new document (dealership name), create a new collection with (department)
    db.collection("results").document(database_info[1]).collection(database_info[3]).document(database_info[0]).set(data)


# pull results from the database
@app.route('/generate-results', methods=['POST'])
def generate_results():
    try:
        # Firestore database
        db = firestore.client()

        # Access the 'results' collection
        collection_ref = db.collection('results')

        # Dictionary to hold results
        results = []

        # Fetch dealership documents explicitly
        dealership_docs = collection_ref.list_documents()
        for dealership_doc_ref in dealership_docs:
            # Get the dealership name from the document reference

            # Fetch all subcollections within the current dealership
            subcollections = dealership_doc_ref.collections()
            for subcollection_ref in subcollections:
                # Fetch submission documents within each subcollection
                submission_docs = subcollection_ref.stream()
                for submission_doc in submission_docs:
                    submission_data = submission_doc.to_dict()  # Get submission data
                    results.append(submission_data)

        # Return results
        return jsonify(results), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
