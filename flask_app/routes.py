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
from flask_app.media_analysis import count_cars_in_footage, assess_hospitality, count_parking_spaces
from flask_app.brand_detection.logo import LogoDetector
from flask_app.computer_vision.square_footage_detector import compute_square_footage
from flask_app.emotional_recognition.emotion_detector import compute_satisfaction
from flask_app.audit_results import build_audit_results
# firebase auth
import firebase_admin
import firebase_admin.auth as auth
from firebase_admin import credentials, storage, firestore
from datetime import datetime,timedelta
import time
from dateutil import parser
import concurrent.futures
from collections import defaultdict

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
    name = request.form['uploadName']
    print("uploadName", request.form['uploadName'])
    email = request.form['email']
    print("email: ", email)

    dealership_info = (brandName, dealershipName, department, country, submission,uid,sales,uio, email, name)

    # Computer Vision Tasks

    # emotion files in list
    emotional_files = []
    emotional_paths = []
    index = 0
    while f'emotion[{index}]' in request.files:
        file = request.files[f'emotion[{index}]']
        emotional_files.append(file.filename)
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.root_path, 'static', 'main', 'media', filename)
        file.save(save_path)
        emotional_paths.append(save_path)
        index += 1
     
    # Run emotional if there are emotional files   
    if len(emotional_files) != 0:
        compute_satisfaction(emotional_paths[0], dealership_info)
    
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
    build_audit_results(cv_results, dealership_info,int(sales),int(uio))
                  
    # add the form info to the database


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
    # get the user token
    token = request.json.get('userToken')
    # decode the token
    decoded_token = auth.verify_id_token(token)
    user_email = decoded_token['email']

    # get the admins database
    collection_ref = db.collection('admins')
    # find the document with the user's email
    user_doc = collection_ref.document(user_email).get()

    # if present, then the user is an admin
    if user_doc.exists:
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
       
            # put the data in a json
            data = {'email': email}
            
             # go to the collection, create a new document (admin id), and append the user email
            db.collection("admins").document(email).set(data)
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
# prepopulate the dealerships table with a .json
#
@app.route('/prepopulate-dealerships', methods=['POST'])
def prepopulate_dealerships():

    # get the time of submission
    time = request.form['updated']

    # what the file is stored under
    category = "dealerships"
    index = 0

    # loop the the files sent (only 1 for now, but can support multiple)
    while f'{category}[{index}]' in request.files:
        file = request.files[f'{category}[{index}]']

        try:
            # not an empty file
            if file.filename != '':
                # read the contents of file
                file_content = file.stream.read().decode('utf-8')

                # turn into JSON
                json_data = json.loads(file_content)

                # loop through each json in the list
                for dealership in json_data:
                    # set up json for dealership data
                    data = {
                        'UID': dealership['UID'],
                        'Dealership Name': dealership['Dealership Name'],
                        'Brand': dealership['Brand'],
                        'City': dealership['City'],
                        'State': dealership['State'],
                        'UIO': dealership['UIO'],
                        'Sales': dealership['Sales'], 
                        'Country': dealership['Country'],
                        'Updated': time
                    }

                    # HAVE CHECKS IF NEEDED. CURRENTLY OVERRIDES THE DATA

                    # insert this data into the dealerships table
                    db.collection("dealerships").document(dealership['UID']).set(data)

        except Exception as e:
            error_message = f"Error during {category} processing: {str(e)}"
            print(error_message)
            return jsonify({'error': error_message}), 500

        index += 1


    return jsonify("ok")

#
# populate user table in admin console
#
@app.route('/all-users', methods=['POST'])
def all_users():

    # list of all users
    user_list = []

    # access the database of all users
    users = auth.list_users()

    # fetch user data
    def fetch_user_data(user):

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
        
        return user_data

    # execute this using concurrent.futures to iterate through users
    with concurrent.futures.ThreadPoolExecutor() as executor:
       for user_data in executor.map(fetch_user_data, users.iterate_all()):
        user_list.append(user_data)

    return jsonify(user_list)


#
# delete a user from the list
#
@app.route('/delete-user', methods=['POST'])
def delete_user():
    # get user info
    email = request.form['email']
    role = request.form['role']

    # delete the user from auth
    user = auth.get_user_by_email(email)
    auth.delete_user(user.uid)

    # if the user is an admin
    if role == "Admin":
        # go to dealerships table in db
        collection_ref = db.collection('admins')

        # search the admins for the field uid
        user_doc = collection_ref.document(email).get()

        # if present, then we delete the user from table
        if user_doc.exists:
            user_doc.reference.delete()

        
    return jsonify("ok")

#
# delete a dealership from the list
#
@app.route('/delete-dealership', methods=['POST'])
def delete_dealership():
    # get dealership info
    uid = request.form['uid']

    # go to dealerships table in db
    collection_ref = db.collection('dealerships')

    # search the dealerships for the field uid
    dealership_doc = collection_ref.document(uid).get()

    # if present, then we delete the dealership
    if dealership_doc.exists:
        dealership_doc.reference.delete()

    # ADD DELETE SUBMISSION DATA IN RESULTS TABLE
        
    return jsonify("ok")

#
# delete a submission from the list
#
@app.route('/delete-submission', methods=['POST'])
def delete_submission():

    # get dealership info
    name = request.form['name']
    brand = request.form['brand']
    time = request.form['time']
    department = request.form['department']

    # path to delete
    submission_doc = db.collection("results").document(name).collection(department).document(time).get()
    # if present, then we delete the submission
    if submission_doc.exists:
        submission_doc.reference.delete()
        
    return jsonify("ok")

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
# edit user role
#
@app.route('/user-update-values', methods=['POST'])
def user_update_values():
    # get form inputs
    email = request.form['email']
    new_role = request.form['new_role']
    old_role = request.form['old_role']

    try:
        # go to admins table
        reference = db.collection("admins")

        # search the table for document that contains the field email
        admin_query = reference.where('email', '==', email).limit(1).get()
        if admin_query:
            for doc in admin_query:
                # if the current role is admin, then remove from db
                # if the user's role is being changed from admin to auditor
                if old_role == "Admin" and new_role == "Auditor":
                    # delete from the db
                    doc.reference.delete()
        else:
            # if the current role is auditor, then add to db
            if old_role == "Auditor" and new_role == "Admin":
                # add to the db their email
                reference.document(email).set({'email': email})

        return jsonify("User role updated successfully"), 200
    
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
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
    

#
# update the detection values in the submission
#
@app.route('/submission-update-values', methods=['POST'])
def submission_update_values():
    # get form inputs
    new_cars = request.form['cars']
    new_logo = request.form['logo']
    new_parking = request.form['parking']
    new_hospitality = request.form['hospitality']
    new_spatial = request.form['spatial']

    new_detection = [new_logo, new_cars, new_parking, new_hospitality, new_spatial]

    # get dealership information
    name = request.form['dealershipName'] # dealership name
    submission = request.form['time'] # submission time
    department = request.form['department'] # department

    try:
        # path to update
        submission_doc = db.collection("results").document(name).collection(department).document(submission).get()
        # if present, then we delete the submission
        if submission_doc.exists:
            # update the detection to the new
            submission_doc.reference.update({
                'Detection': new_detection
            })

        # get the uid from submission
        uid = submission_doc.to_dict().get('UID')
            
        # after search this uid in the dealerships
        dealership_doc = db.collection("dealerships").document(uid).get()

        if dealership_doc.exists:
            # extract the uio and sales
            uio = int(dealership_doc.to_dict().get('UIO'))
            sales = int(dealership_doc.to_dict().get('Sales'))
            brand = dealership_doc.to_dict().get('Brand')

            # recalculate the grades with the new values
            grades = rebuild_audit_results(brand, new_detection, uio, sales)
            print("grades", grades)
            #return [scores, categories, total_score]

            # update the fields in the submission here
            test = submission_doc.to_dict().get('Category Eval')
            print(test)

            # update the evaluation scores in submission_doc
            submission_doc.reference.update({
                db.field_path(u'Category Eval'): {
                    (u'Categories'): grades[1],
                    (u'Scores'): grades[0]
                },
               db.field_path(u'Overall Eval'): {
                  'Scores': grades[2]
              }
            })
        
        return jsonify("Submission updated successfully"), 200
    
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
#    
# rebuilds the audit results on new values
#    
def rebuild_audit_results(brand, new_detection, past_sales=150, uio=300):
    print("rebuild_audit_results called")

    # extract results from various evaluations to build results
    detected_logo = new_detection[0]
    num_cars = float(new_detection[1])
    num_parking = float(new_detection[2])
    num_seating = float(new_detection[3])
    sq_footage = float(new_detection[4])

    # extract the minimum brand compliance
    minimum_doc = db.collection("Brand compliance limits").document(brand).get()

    if minimum_doc.exists:
        minimum_dict = minimum_doc.to_dict()
        cars_min = float(minimum_dict.get('minCars'))
        parking_min = float(minimum_dict.get('minParking'))
        seating_min = float(minimum_dict.get('minSeating'))
        sq_footage_min = float(minimum_dict.get('minSqFt'))

        # evaluation grades
        def calculate_evaluation_grades():
            # ratios
            cars_ratio = 0.005
            parking_ratio = 0.007
            seating_ratio = 0.004
            sq_footage_ratio = .025

            # grade evaluation results
            eval_factor = (past_sales + uio)//2
            minParkingFactor = int(num_parking)/int(parking_min) + 1
            minCarFactor = int(num_cars)/int(cars_min)+1
            minSeatingFactor = int(num_seating)/int(seating_min) +1
            minSqFactor = int(sq_footage)/int(sq_footage_min) +1
            grades = {}

            # logo detection
            if detected_logo.upper() == brand.upper():
                logo_result = ('Great', 4, detected_logo)
            else:
                logo_result = ('Poor', 1, detected_logo)

            grades['Logo'] = logo_result

            # cars detection
            if num_cars < cars_min:
                cars_result = ('Poor', 1, num_cars)
            elif num_cars < cars_min+(eval_factor*cars_ratio*minCarFactor):
                cars_result = ('Unsatisfactory', 2, num_cars)
            elif num_cars == cars_min+(eval_factor*cars_ratio*minCarFactor) or cars_min+(eval_factor*cars_ratio*minCarFactor*2):
                cars_result = ('Good', 3, num_cars)
            elif num_cars >= cars_min+(eval_factor*cars_ratio*minCarFactor*2):
                cars_result = ('Great', 4, num_cars)

            min_vals = (cars_min,cars_min+(eval_factor*cars_ratio*minCarFactor),cars_min+(eval_factor*cars_ratio*minCarFactor*2))
            cars_result = cars_result + min_vals
            grades['Cars'] = cars_result 

            # parking detection
            if num_parking < parking_min:
                parking_result = ('Poor', 1, num_parking)
            elif num_parking < parking_min+(eval_factor*parking_ratio*minParkingFactor):
                parking_result = ('Unsatisfactory', 2, num_parking)
            elif num_parking == parking_min+(eval_factor*parking_ratio*minParkingFactor) or parking_min+(eval_factor*parking_ratio*minParkingFactor*2):
                parking_result = ('Good', 3, num_parking)
            elif num_parking >= parking_min+(eval_factor*parking_ratio*minParkingFactor*2):
                parking_result = ('Great', 4, num_parking)

            min_vals = (parking_min,parking_min+(eval_factor*parking_ratio*minParkingFactor),parking_min+(eval_factor*parking_ratio*minParkingFactor*2))
            parking_result = parking_result + min_vals
            grades['Parking'] = parking_result

            # hospitality detection
            if num_seating < seating_min:
                seating_result = ('Poor', 1, num_seating)
            elif num_seating < seating_min+(eval_factor*seating_ratio*minSeatingFactor):
                seating_result = ('Unsatisfactory', 2, num_seating)
            elif num_seating == seating_min+(eval_factor*seating_ratio*minSeatingFactor) or num_seating < seating_min+(eval_factor*seating_ratio*minSeatingFactor*2):
                seating_result = ('Good', 3, num_seating)
            elif num_seating >= seating_min+(eval_factor*seating_ratio*minSeatingFactor*2):
                seating_result = ('Great', 4, num_seating)

            min_vals = (seating_min,seating_min+(eval_factor*seating_ratio*minSeatingFactor),seating_min+(eval_factor*seating_ratio*minSeatingFactor*2))
            seating_result = seating_result + min_vals
            grades['Hospitality'] = seating_result

            # spatial detection
            if sq_footage < sq_footage_min:
                sq_footage_result = ('Poor', 1, sq_footage)
            elif sq_footage < sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor):
                sq_footage_result = ('Unsatisfactory', 2, sq_footage)
            elif sq_footage == sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor) or sq_footage < sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2):
                sq_footage_result = ('Good', 3, sq_footage)
            elif sq_footage >= sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2):
                sq_footage_result = ('Great', 4, sq_footage)
        
            min_vals = (sq_footage_min,sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor),sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2))
            sq_footage_result = sq_footage_result + min_vals
            grades['Spatial'] = sq_footage_result

            return grades   
    
        grades = calculate_evaluation_grades()

        qualitative_scale = {1: 'Poor', 2: 'Unsatisfactory', 3: 'Good', 4: 'Great'} 

        def calculate_overall_score():
            # Build an overall score using grades from different evaluations
            total_score = 0

            for grade in grades.values():
                total_score += grade[1]

            final_grade = total_score // 5
            final_grade = qualitative_scale[final_grade]

            return total_score, final_grade
    
        total_score, final_grade = calculate_overall_score()

        # Extract categories and their scores
        categories = ['Logo', 'Cars', 'Parking', 'Hospitality', 'Spatial']
        scores = [grades[category][1] for category in categories]
        detection = [grades[category][2] for category in categories]

        grades = calculate_evaluation_grades()

        # return the scores values
        return [scores, categories, total_score]

        

# pull results from the database
@app.route('/generate-results', methods=['POST'])
def generate_results():

    # extract the current user's email
    email = request.form['email']
    admin = False

    try:

         # find the document with the user's email
        admin_doc = db.collection('admins').document(email).get()
        
        if admin_doc.exists:
            # user is an admin
            admin = True

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

                    if admin:
                        # admin append the submission
                        results.append(submission_data)
                    else:
                        # user append submission only if the email matches
                        if submission_data.get('User') == email:
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
        uploadName = data.get('uploadName')

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

            if date:
                # Extract month, day, and year from submission date in the database
                submission_date = parser.parse(result['Submitted'])
                submission_month = submission_date.month
                submission_day = submission_date.day
                submission_year = submission_date.year

                provided_date = parser.parse(date)
                provided_month = provided_date.month
                provided_day = provided_date.day
                provided_year = provided_date.year

                # Check if the submission date matches the provided date components
                if (not dealership or result['Dealership Name'].lower() == dealership.lower()) and \
                   (not brand or result['Brand'].lower() == brand.lower()) and \
                   (not department or result['Department'].lower() == department.lower()) and \
                   (not uploadName or result['Upload Name'] == uploadName) and \
                   (not country or result['Country'].lower() == country.lower()) and \
                   (submission_month == provided_month and submission_day == provided_day and submission_year == provided_year):
                    filtered_results.append(result)
            else:
                # Check if other criteria match when date is not provided
                if (not dealership or result['Dealership Name'].lower() == dealership.lower()) and \
                    (not brand or result['Brand'].lower() == brand.lower()) and \
                    (not department or result['Department'].lower() == department.lower()) and \
                    (not country or result['Country'].lower() == country.lower()) and \
                    (not uploadName or result['Upload Name'] == uploadName):
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
    

# get the category eval
@app.route('/get-category-eval', methods=['POST'])
def get_category_eval():
    # get the submission
    submission = request.form['submission']
    name = request.form['name']
    department = request.form['department']

    # access the database

    # results collection
    collection_ref = db.collection('results')

    # dealership doc
    dealership_ref = collection_ref.document(name)

    # department collection
    department_ref = dealership_ref.collection(department)

    #submission document
    submission_ref = department_ref.document(submission)

    print(submission_ref.get().exists)
    # get submission data
    if submission_ref.get().exists:
        submission_data = submission_ref.get().to_dict()


        return jsonify(submission_data), 200
       
    else:
        return jsonify({"error": "Submission not found"}), 404

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

@app.route('/get_brand_compliance_limits', methods=['GET'])
def get_brand_compliance_limits():
    try:
        brand_limits = []
        docs = db.collection('Brand compliance limits').get()
        for doc in docs:
            data = doc.to_dict()
            brand_limits.append(data)
        return jsonify(brand_limits)
    except Exception as e:
        return jsonify({'error': str(e)})


# Dashboard Related Calls
    
@app.route('/get_submitted_data', methods=['GET'])
def get_submitted_data():
    submitted_list = []

    top_collection = db.collection('results') 


    top_documents = list(top_collection.stream())


    for document in top_documents:

        nested_collections = document.reference.collections()
        for nested_collection in nested_collections:

            nested_documents = nested_collection.stream()


            for nested_document in nested_documents:
                nested_data = nested_document.to_dict()

                #acess name, submitted time, upload name
                name = nested_data.get('Dealership Name')
                submitted = nested_document.get('Submitted')
                upload = nested_data.get('Upload Name')
                print(upload)
                given_datetime = datetime.strptime(submitted, "%Y-%m-%dT%H:%M:%S.%fZ")
                current_datetime = datetime.utcnow()
                time_difference = current_datetime - given_datetime

                # Check if the time difference is less than 24 hours
                if time_difference < timedelta(hours=24):
                    result_str = f"{name}: {upload}"
                    submitted_list.append(result_str)

    return jsonify(submitted_list)

@app.route('/get_top_data', methods=['GET'])
def get_top_data():

    topDealerships = {}


    top_collection = db.collection('results') 
    top_level_documents = list(top_collection.stream())

    for top_level_document in top_level_documents:

        nested_collections = top_level_document.reference.collections()

        for nested_collection in nested_collections:
            nested_documents = nested_collection.stream()


            for nested_document in nested_documents:
                #acess name, submitted time, upload name, uid
                nested_data = nested_document.to_dict()
                submitted = nested_document.get('Submitted')
                uid = nested_document.get('UID')
                overall_eval = nested_data.get('Overall Eval')
                dealershipName = nested_data.get('Dealership Name')

                score = overall_eval.get('Scores')

                #add to dict in not in
                if dealershipName not in topDealerships:
                    topDealerships[dealershipName] = [uid,score,submitted]
                #if in check if it is more recent than the latest
                else:
                    datetime_prev = datetime.strptime(topDealerships[dealershipName][2], "%Y-%m-%dT%H:%M:%S.%fZ")
                    datetime_curr = datetime.strptime(submitted, "%Y-%m-%dT%H:%M:%S.%fZ")
                    if datetime_curr > datetime_prev:
                       topDealerships[dealershipName] = [uid,score,submitted]

    # Sort the dictionary in descending order by score
    sorted_dealerships = sorted(topDealerships.items(), key=lambda x: x[1][1], reverse=True)

    #top 25 entries
    top25 = sorted_dealerships[:25]
                

    return jsonify(top25)


@app.route('/get_names', methods=['GET'])
def get_names():
    type = request.args.get('type')
    query = request.args.get('query')

    # Initialize averages dictionary
    averages = defaultdict(list)

    # if the type is a brand
    if type == 'brand':
        # Get all documents from the "results" collection
        top_collection = db.collection('results') 
        top_level_documents = list(top_collection.stream())

        brand_scores = defaultdict(list)

        for top_level_document in top_level_documents:
            nested_collections = top_level_document.reference.collections()

            for nested_collection in nested_collections:
                nested_documents = nested_collection.stream()

                for nested_document in nested_documents:
                    nested_data = nested_document.to_dict()

                    # Check if the brand name matches the query
                    if query.lower() in nested_data["Brand"].lower():
                        brand_name = nested_data["Brand"]

                        # Aggregate scores for each category
                        overall_eval = nested_data.get('Category Eval')
                        scores = overall_eval.get('Scores')
                        if scores:
                            brand_scores[brand_name].append(scores)

        # Calculate averages for each brand
        for brand_name, scores_list in brand_scores.items():
            num_scores = len(scores_list)
            if num_scores > 0:
                averages['Name'].append(brand_name)
                averages['Logo Avg'].append(round(sum(score[0] for score in scores_list) / num_scores,2))
                averages['Car Avg'].append(round(sum(score[1] for score in scores_list) / num_scores,2))
                averages['Parking Avg'].append(round(sum(score[2] for score in scores_list) / num_scores,2))
                averages['Hospitality Avg'].append(round(sum(score[3] for score in scores_list) / num_scores,2))
                averages['Spatial Avg'].append(round(sum(score[4] for score in scores_list) / num_scores,2))

    # if the type is a dealership
    elif type == 'dealership':
        # Get all documents from the "results" collection
        top_collection = db.collection('results') 
        top_level_documents = list(top_collection.stream())

        dealership_scores = defaultdict(list)

        for top_level_document in top_level_documents:
            nested_collections = top_level_document.reference.collections()

            for nested_collection in nested_collections:
                nested_documents = nested_collection.stream()

                for nested_document in nested_documents:
                    nested_data = nested_document.to_dict()

                    # Check if the dealership name matches the query
                    if query.lower() in nested_data["Dealership Name"].lower():
                        dealership_name = nested_data["Dealership Name"]

                        # Aggregate scores for each category
                        overall_eval = nested_data.get('Category Eval')
                        scores = overall_eval.get('Scores')
                        if scores:
                            dealership_scores[dealership_name].append(scores)

        # Calculate averages for each dealership
        for dealership_name, scores_list in dealership_scores.items():
            num_scores = len(scores_list)
            if num_scores > 0:
                averages['Name'].append(dealership_name)
                averages['Logo Avg'].append(round(sum(score[0] for score in scores_list) / num_scores,2))
                averages['Car Avg'].append(round(sum(score[1] for score in scores_list) / num_scores,2))
                averages['Parking Avg'].append(round(sum(score[2] for score in scores_list) / num_scores,2))
                averages['Hospitality Avg'].append(round(sum(score[3] for score in scores_list) / num_scores,2))
                averages['Spatial Avg'].append(round(sum(score[4] for score in scores_list) / num_scores,2))

    print(averages)

    return jsonify(averages)


from collections import defaultdict
from flask import jsonify

@app.route('/get_dealership_data', methods=['GET'])
def get_dealership_data():
    clicked_dealership = request.args.get('dealership')
    top_collection = db.collection('results') 
    top_level_documents = list(top_collection.stream())
    
    dealership_scores = defaultdict(list)

    for top_level_document in top_level_documents:
        nested_collections = top_level_document.reference.collections()

        for nested_collection in nested_collections:
            nested_documents = nested_collection.stream()

            for nested_document in nested_documents:
                nested_data = nested_document.to_dict()
                if nested_data['Dealership Name'] == clicked_dealership:
                    department = nested_data['Department']
                    # Get the overall score from 'Overall Eval' section
                    overall_score = nested_data['Overall Eval']['Scores']
                    dealership_scores[department].append(overall_score)

    # Calculate the total score and average score for all departments
    total_score = sum(sum(scores) for scores in dealership_scores.values())
    total_departments = len(dealership_scores)
    average_score = total_score / total_departments if total_departments > 0 else 0
    
    # Construct the response with total and average scores for each department
    department_scores = {}
    for department, scores in dealership_scores.items():
        if scores:
            total_score = sum(scores)
            average_score = total_score / len(scores)
        else:
            total_score = 0
            average_score = 0
        department_scores[department] = {'total_score': total_score, 'average_score': round(average_score,2)}
    
    return jsonify(department_scores)



@app.route('/get_brand_data', methods=['GET'])
def get_brand_data():
    clicked_brand = request.args.get('brand')

    top_collection = db.collection('results') 
    top_level_documents = list(top_collection.stream())

    brand_scores = defaultdict(lambda: defaultdict(list))

    for top_level_document in top_level_documents:
        nested_collections = top_level_document.reference.collections()

        for nested_collection in nested_collections:
            nested_documents = nested_collection.stream()

            for nested_document in nested_documents:
                nested_data = nested_document.to_dict()

                # Check if the brand name matches the query
                if nested_data['Brand'] == clicked_brand:
                    brand_name = nested_data["Brand"]
                    dealership_name = nested_data["Dealership Name"]

                    overall_score = nested_data['Overall Eval']['Scores']

                    # Append the overall score for each dealership within the brand
                    brand_scores[brand_name][dealership_name].append(overall_score)

    # Calculate the total and average score for each dealership within the brand
    dealership_scores = {}
    for brand, dealerships in brand_scores.items():
        for dealership, scores in dealerships.items():
            if scores:
                total_score = sum(scores)
                average_score = total_score / len(scores)
            else:
                total_score = 0
                average_score = 0
            # Update dealership_scores with total and average scores for each dealership
            if dealership in dealership_scores:
                dealership_scores[dealership]['total_score'] += total_score
                dealership_scores[dealership]['average_score'] = round((dealership_scores[dealership]['total_score']) / len(brand_scores),2)
            else:
                dealership_scores[dealership] = {'total_score': total_score, 'average_score': round(average_score,2)}

    return jsonify(dealership_scores)


@app.route('/get_data_for_item', methods=['GET'])
def get_data_for_item():
    upload_name = request.args.get('item')
    parts = upload_name.split(":")

    # Get the second part (index 1) after splitting
    upload_name = parts[1].strip()

    top_collection = db.collection('results') 
    top_level_documents = list(top_collection.stream())

    navigateToResults = {
          'Department': '',
          'Brand': '',
          'Dealership Name': '',
          'Submitted': ''
    }
       
    print("UPLOAD NAME", upload_name)
    for top_level_document in top_level_documents:
        nested_collections = top_level_document.reference.collections()

        for nested_collection in nested_collections:
            nested_documents = nested_collection.stream()

            for nested_document in nested_documents:
                nested_data = nested_document.to_dict()
                print(nested_data)
                if nested_data['Upload Name'].lower() == upload_name.lower():
                    navigateToResults['Dealership Name'] = nested_data["Dealership Name"]
                    navigateToResults['Brand'] = nested_data["Brand"]
                    navigateToResults['Department'] = nested_data["Department"]
                    navigateToResults['Submitted'] = nested_data["Submitted"]

        
    return jsonify(navigateToResults)
