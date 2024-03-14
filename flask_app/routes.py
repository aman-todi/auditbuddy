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
from flask_app.audit_results import build_audit_results
# firebase auth
import firebase_admin
import firebase_admin.auth as auth
from firebase_admin import credentials, storage, firestore
from datetime import datetime
import time
from dateutil import parser
import concurrent.futures

ANNOTATED_IMAGES_FOLDER = os.path.join(app.root_path, 'static', 'main', 'annotated_images')

bucket = storage.bucket()

# Firestore database
db = firestore.client()

# route home
@app.route('/')
def root():
	return render_template('index.html')

# route other paths
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

@app.route('/get-graph-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_annotated_images_graph(brandName,dealershipName,department,submission):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/{department}/{submission}/GraphResults/'
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

    # simulate stopwatch
    start_time = time.time()

    # basic dealership info
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
    uid = request.form['uid']
    print("uid", request.form['uid'])
    sales = request.form['sales']
    print("sales", request.form['sales'])
    uio = request.form['uio']
    print("uio", request.form['uio'])

    dealership_info = (brandName, dealershipName, department, country, submission, uid, sales, uio)

    # Computer Vision Tasks
    
    # spatial files in list
    spatial_files = []
    spatial_paths = []
    index = 0
    while f'spatial[{index}]' in request.files:
        file = request.files[f'spatial[{index}]']
        spatial_files.append(file.filename)
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.root_path, 'static', 'main', 'media', filename)
        file.save(save_path)
        spatial_paths.append(save_path)
        index += 1
    print("Running Spatial")
    sq_ft_result = compute_square_footage(spatial_files,dealership_info)  

    for file in spatial_paths:
        if os.path.exists(file):
            os.remove(file)    

    if sq_ft_result == -1:
        error_message = f"No image named calibration was found"
        print(error_message)
        return jsonify({'error': error_message}), 404

    # loop the detection categories
    required_categories = ['logo', 'cars', 'parking','hospitality', 'spatial']

    # logic for extracting file from different categories (works for multi files)
    for category in required_categories:
        files_list = []
        index = 0
        # loop through all files and put it in a list
        while f'{category}[{index}]' in request.files:
            file = request.files[f'{category}[{index}]']

            try:
                filename = secure_filename(file.filename)
                save_path = os.path.join(app.root_path, 'static', 'main', 'media', filename)
                file.save(save_path)
                files_list.append(save_path)

            except Exception as e:
                error_message = f"Error during {category} processing: {str(e)}"
                print(error_message)
                return jsonify({'error': error_message}), 500

            index += 1

        # call computer vision functions to process the media
        if category == 'logo':
            logo_detector = LogoDetector(dealership_info)
            logo_result = logo_detector.detect_logos_image(files_list[0]) # only one image supported for this feature currently

        elif category == 'cars':
            num_cars = count_cars_in_footage(files_list,dealership_info)

        elif category == 'parking':
            num_parking = count_parking_spaces(files_list,dealership_info)

        elif category == 'hospitality':
            num_seating = assess_hospitality(files_list,dealership_info)

        elif category == 'spatial':
            pass

        for file in files_list:
            if os.path.exists(file):
                os.remove(file)
            
    # Build audit score
    cv_results = (logo_result, num_cars, num_parking, num_seating, sq_ft_result)
    build_audit_results(cv_results, dealership_info)
                  
    print("Logo detected:", logo_result)
    print("Number of cars:", num_cars)
    print("Number of parking spaces:", num_parking)
    print("Seating capacity:", num_seating)
    print("Square footage:", sq_ft_result)

    end_time = time.time()

    print(f"Total Execution Time: {end_time - start_time} seconds")

    return jsonify({'message': 'Files uploaded and processed successfully'}), 200

#
# checks if a user is an admin
#
@app.route('/check-admin', methods=['POST'])
def check_admin():
    # get the admins database
    admins = {}
    collection_ref = db.collection('admins')
    for doc in collection_ref.stream():
    # get document name (key) and email (value)
        doc_name = doc.id
        email = doc.to_dict().get('email')
    
        # add to the dictionary
        admins[doc_name] = email

    # get the user token
    token = request.json.get('userToken')
    #decode the token
    decoded_token = auth.verify_id_token(token)
    user_email = decoded_token['email']

    # check if the current user is an admin
    if user_email in admins.values():
        return jsonify({'isAdmin': True}), 200

    return jsonify({'isAdmin': False}), 200

#
# creates a user through the admin console page
#
@app.route('/create-user', methods=['POST'])
def create_user():
    # get user info from request
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role')

    try:
        # for admins, add to the database
        if role == "Admin":
            user = auth.create_user(email=email, password=password)
            # get the next id
            collection_ref = db.collection("admins")
            docs = list(collection_ref.stream())
            next_id = int(docs[-1].id) + 1

            # put the data in a json
            data = {'email': email}
            
             # go to the collection, create a new document (admin id), and append the user email
            db.collection("admins").document(str(next_id)).set(data)
        elif role == "Auditor":
            user = auth.create_user(email=email, password=password)
     
        return jsonify({'email': user.email}), 201  # user email upon success
    except Exception as e:
        return jsonify({'error': str(e)}), 400  # error

#
# populate dealerships table
#
@app.route('/user-dealerships', methods=['POST'])
def user_dealerships():
    # access the database
    collection_ref = db.collection('dealerships')

    # extract the data from database and put dict in list
    docs = [doc.to_dict() for doc in collection_ref.stream()]

    return jsonify(docs)

#
# populate user table in admin console
#
@app.route('/all-users', methods=['POST'])
def all_users():

    # list of all users
    user_list = []

    # access the database of all users
    users = auth.list_users()

    # iterate through each user
    for user in users.iterate_all():

        #jsonify the data
        user_data = {
            'email': user.email,
            'role': "Auditor" 
        }

        # check if the user is an admin
        collection_ref = db.collection("admins")
        email_list = [doc.to_dict()['email'] for doc in collection_ref.stream()]

        if user.email in email_list:
            user_data['role'] = "Admin"
        
        user_list.append(user_data)


    return jsonify(user_list)

#
# add dealership to the database
#
@app.route('/add-dealership', methods=['POST'])
def add_dealership():
    # get form inputs
    name = request.form['name']
    brand = request.form['brand']
    city = request.form['city']
    state = request.form['state']
    uio = request.form['uio']
    sales = request.form['sales']
    country = request.form['country']
    updated = request.form['updated']

    # access the database
    collection_ref = db.collection('dealerships')

    # check if the dealership already exists
    # extract the data from database and put dict in list
    docs = [doc.to_dict() for doc in collection_ref.stream()]

    exists = any(doc['Dealership Name'] == name and doc['City'] == city and doc['State'] == state for doc in docs)

    if exists:
        return jsonify({'error': 'Dealership already exists'}), 400
  
    # calculate the uid from the brand
    #three first letters of the brand
    abbreviation = brand[:3].upper()

    # find the next number
    def get_next_number(brand_abbr):
        # get all the documents in dealership
        brand_docs = collection_ref.stream()
        # find all the documents that start with the abbreviated brand
        brand_numbers = [int(doc.id[len(brand_abbr):]) for doc in brand_docs if doc.id.startswith(brand_abbr)]

        return max(brand_numbers, default=0) + 1

    # next number
    next_id = get_next_number(abbreviation)
    # new uid to push
    new_uid = abbreviation + str(next_id)

    # set up json for user data
    data = {
            'UID': new_uid,
            'Dealership Name': name,
            'Brand': brand,
            'City': city,
            'State': state,
            'UIO': uio,
            'Sales': sales, 
            'Country': country,
            'Updated': updated
            }
            
    # go to the collection, create a new document (user id), and append the user email
    db.collection("dealerships").document(str(new_uid)).set(data)


    return jsonify("Dealership added successfully"), 200

#
# edit dealership uio/sales
#
@app.route('/dealership-update-values', methods=['POST'])
def dealership_update_values():
    # get form inputs
    uid = request.form['uid']
    new_sales = request.form['new_sales']
    new_uio = request.form['new_uio']
    updated = request.form['updated']

    try:
        # go to dealerships table
        # search the table for the document with uid
        reference = db.collection("dealerships").document(str(uid))
    
        # update the 'UIO' and 'Sales' to the new values
        reference.update({
            'UIO': new_uio,
            'Sales': new_sales,
            'Updated': updated
        })

        return jsonify("Dealership uio and sales updated successfully"), 200
    
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

# pull results from the database
@app.route('/generate-results', methods=['POST'])
def generate_results():
    try:
        # Access the 'results' collection
        collection_ref = db.collection('results')

        # Fetch all dealership documents explicitly
        dealership_docs = list(collection_ref.list_documents())

        # List to hold results
        results = []

        # fetch submissions for a dealership
        def fetch_submission_data(dealership_doc_ref):
            # access the subcollection submissions
            subcollections = dealership_doc_ref.collections()

            # loop through each subcollection
            for subcollection_ref in subcollections:
                # Fetch submission documents within each subcollection
                submission_docs = subcollection_ref.stream()
                for submission_doc in submission_docs:
                    submission_data = submission_doc.to_dict()  # Get submission data
                    results.append(submission_data)

            return results

        # use concurrent.futures.ThreadPoolExecutor to fetch submission data concurrently
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # call function fetch_submission_data for each dealership
            {executor.submit(fetch_submission_data, dealership_doc_ref): dealership_doc_ref for dealership_doc_ref in dealership_docs}
        
        # sort results by uid
        results = sorted(results, key=lambda x: x.get('UID', ''))
        # Return results
        return jsonify(results), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/search-results', methods=['POST'])
def search_results():
    try:
        # Get search criteria from request
        print("Made it to search results")
        data = request.json
        dealership = data.get('dealership')
        brand = data.get('brand')
        department = data.get('department')
        country = data.get('country')
        date = data.get('date')

        print("Made it past Gets",data)
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

        filtered_results = []
        for result in results:
            # Extract month, day, and year from submission date in the database
            submission_date = parser.parse(result['Submitted'])
            submission_month = submission_date.month
            submission_day = submission_date.day
            submission_year = submission_date.year

            # Extract month, day, and year from the provided date for comparison
            provided_date = parser.parse(date)
            provided_month = provided_date.month
            provided_day = provided_date.day
            provided_year = provided_date.year

            # Check if the submission date matches the provided date components
            if (not dealership or result['Dealership Name'].lower() == dealership) and \
               (not brand or result['Brand'].lower() == brand) and \
               (not department or result['Department'].lower() == department) and \
               (not country or result['Country'].lower() == country) and \
               (not date or (submission_month == provided_month and submission_day == provided_day and submission_year == provided_year)):
                filtered_results.append(result)


        print("Got filtered results",len(filtered_results))
        print(filtered_results)

        # Return search results
        return jsonify(filtered_results), 200
    except Exception as e:
        # Handle errors
        error_message = f"Error fetching search results: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500
    



@app.route('/submit-min-requirements', methods=['POST'])
def submit_min_requirements():
    data = request.json   
    brand = data['selectedBrand']
    minCars = data['minCars']
    minParking = data['minParking']
    minSeating = data['minSeating']
    minSqFt = data['minSqFt'] 

    minRef = db.collection('Brand compliance limits').document(brand)

    minRef.update({
        'minCars': minCars,
        'minParking': minParking,
        'minSeating': minSeating,
        'minSqFt': minSqFt
    })
    return jsonify({'message': 'Success'})

