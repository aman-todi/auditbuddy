from flask import current_app as app,send_from_directory
from flask import render_template, redirect, request, jsonify, send_from_directory,abort
from .utils.database.database  import database
from pprint import pprint
import json
import random
import os
db = database()
from werkzeug.utils import secure_filename
# computer vision
from flask_app.brand_detection.logo import LogoDetector
# firebase auth
import firebase_admin
import firebase_admin.auth as auth
from firebase_admin import credentials, storage, firestore
    
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

@app.route('/get-logo-results/<brandName>/<dealershipName>')
def get_annotated_images(brandName,dealershipName):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/LogoResults/'
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
    
@app.route('/get-car-results/<brandName>/<dealershipName>')
def get_annotated_images_c(brandName,dealershipName):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/CarResults/'
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

@app.route('/get-parking-results/<brandName>/<dealershipName>')
def get_annotated_images_p(brandName,dealershipName):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/ParkingResults/'
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
    
@app.route('/get-hospitality-results/<brandName>/<dealershipName>')
def get_annotated_images_h(brandName,dealershipName):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/HospitalityResults/'
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
    
@app.route('/get-spatial-results/<brandName>/<dealershipName>')
def get_annotated_images_s(brandName,dealershipName):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/SpatialResults/'
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
    name = request.form['name']
    print("name: ", name)
    dealership = request.form['dealership']
    print("dealership", dealership)
    department = request.form['department']
    print("department", department)
    country = request.form['country']
    print("country", country)

    #FOR VIDEO ANALYSIS
    # Check if the post request has the file part for all of the categories
    required_categories = ['logo', 'hospitality', 'spatial', 'parking', 'cars']

    if all(key not in request.files for key in required_categories):
        return jsonify({'error': 'No file part in the request'}), 400

    # logic for extracting files from different detection categories
    if 'logo' in request.files:
        logo = request.files['logo']
    if 'hospitality' in request.files:
        hospitality = request.files['hospitality']
    if 'parking' in request.files:
        parking = request.files['parking']
    if 'cars' in request.files:
        cars = request.files['cars']
    if 'spatial' in request.files:
         spatial = request.files['spatial']

    processed_categories = []

    for category in required_categories:
        if category in request.files:
            files = request.files.getlist(category)  # Get list of files for the category
            for file in files:
                filename = secure_filename(file.filename)
                save_path = os.path.join(app.root_path, 'static', 'main', 'media', filename)
                file.save(save_path)

                try:
                    if category == 'logo':
                        logo_detector = LogoDetector()
                        logo_detector.detect_logos_image(save_path)
                    elif category == 'cars':
                        deploy_cvision_tools(save_path)

                    if os.path.exists(save_path):
                        # Delete the file after processing
                        os.remove(save_path)

                    processed_categories.append(category)
                except Exception as e:
                    error_message = f"Error during {category} processing: {str(e)}"
                    print(error_message)
                    return jsonify({'error': error_message}), 500

    if processed_categories:
        return jsonify({'message': f'{", ".join(processed_categories)} uploaded and processed successfully'}), 200
    else:
        return jsonify({'error': 'Unsupported file format'}), 400

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
    

@app.route('/audit/results/<dealershipName>')
def get_dealership_results(dealershipName):
    # Here you can fetch data based on the dealershipName
    # For example, you can query your database for results related to the specified dealershipName
    # Assuming you have fetched data as a dictionary named 'results'
    results = {
        "dealershipName": dealershipName,
        # Add other data fields as needed
    }
    # Return the data as JSON
    return jsonify(results)



