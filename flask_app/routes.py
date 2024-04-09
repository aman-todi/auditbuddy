from flask import current_app as app
from flask import render_template,request, jsonify
from pprint import pprint
import os
from werkzeug.utils import secure_filename
# computer vision
from flask_app.media_analysis import count_cars_in_footage, assess_hospitality, count_parking_spaces
from flask_app.brand_detection.logo import LogoDetector
from flask_app.computer_vision.square_footage_detector import compute_square_footage
from flask_app.emotional_recognition.emotion_detector import compute_satisfaction
from flask_app.audit_results import build_audit_results
# firebase auth
import firebase_admin.auth as auth
from firebase_admin import storage, firestore
from datetime import datetime,timedelta
import time
from collections import defaultdict
# import admin functionality
from flask_app.admin_functionality import check_admin, create_user, all_users, delete_user, user_update_values
from flask_app.admin_functionality import user_dealerships, prepopulate_dealerships, delete_dealership, add_dealership, dealership_update_values
from flask_app.admin_functionality import submit_min_requirements, get_brand_compliance_limits
# import advanced functionality
from flask_app.advanced_functionality import get_annotated_images, delete_submission, submission_update_values, get_category_eval
# import results functionality
from flask_app.results_functionality import generate_results, search_results

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

#
# RESULTS
#

# pull results from the database
@app.route('/generate-results', methods=['POST'])
def generate_results_route():
    return generate_results(request)
    
# search for a result
@app.route('/search-results', methods=['POST'])
def search_results_route():
    return search_results(request)

#
# ADVANCED RESULTS
#

# delete a submission from the list
@app.route('/delete-submission', methods=['POST'])
def delete_submission_route():
    return delete_submission(request)

# update the detection values in the submission
@app.route('/submission-update-values', methods=['POST'])
def submission_update_values_routes():
    return submission_update_values(request)

# get the category eval
@app.route('/get-category-eval', methods=['POST'])
def get_category_eval_route():
    return get_category_eval(request)

# extracts the images from cloud storage when viewing advanced results
@app.route('/get-graph-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_graph_results_route(brandName, dealershipName, department, submission):
    path = "/GraphResults/"
    return get_annotated_images(brandName, dealershipName, department, submission, path)

@app.route('/get-logo-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_logo_results_route(brandName, dealershipName, department, submission):
    path = "/LogoResults/"
    return get_annotated_images(brandName, dealershipName, department, submission, path)
    
@app.route('/get-car-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_car_results_route(brandName, dealershipName, department, submission):
    path = "/CarResults/"
    return get_annotated_images(brandName, dealershipName, department, submission, path)

@app.route('/get-parking-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_parking_results_route(brandName, dealershipName, department, submission):
    path = "/ParkingResults/"
    return get_annotated_images(brandName, dealershipName, department, submission, path)
    
@app.route('/get-hospitality-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_hospitality_results_route(brandName, dealershipName, department, submission):
    path = "/HospitalityResults/"
    return get_annotated_images(brandName, dealershipName, department, submission, path)
    
@app.route('/get-spatial-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_spatial_results_route(brandName, dealershipName, department, submission):
    path = "/SpatialResults/"
    return get_annotated_images(brandName, dealershipName, department, submission, path)
    
@app.route('/get-emotional-results/<brandName>/<dealershipName>/<department>/<submission>')
def get_emotional_results_route(brandName, dealershipName, department, submission):
    path = "/EmotionalResults/"
    return get_annotated_images(brandName, dealershipName, department, submission, path)

#
# UPLOAD
#

# handles the analysis of uploaded media
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

    satisfaction_score = 0
     
    # Run emotional if there are emotional files   
    if len(emotional_files) != 0:
        satisfaction_score = compute_satisfaction(emotional_paths[0], dealership_info)
      

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
            sq_ft_result = compute_square_footage(files_list,dealership_info)
            if sq_ft_result == -1:
                error_message = f"No image named calibration was found"
                print(error_message)
                return jsonify({'error': error_message}), 404
            
        for file in files_list:
            if os.path.exists(file):
                os.remove(file)
        
    # Build audit score
    cv_results = (logo_result, num_cars, num_parking, num_seating, sq_ft_result,satisfaction_score)
    print("CHECKING RESULTS", cv_results)
    build_audit_results(cv_results, dealership_info,int(sales),int(uio))
                  
    print("Logo detected:", logo_result)
    print("Number of cars:", num_cars)
    print("Number of parking spaces:", num_parking)
    print("Seating capacity:", num_seating)
    print("Square footage:", sq_ft_result)
    print("Emotion", satisfaction_score)

    end_time = time.time()

    print(f"Total Execution Time: {end_time - start_time} seconds")

    return jsonify({'message': 'Files uploaded and processed successfully'}), 200


#
# ADMIN FUNCTIONALITY
#

# checks if a user is an admin
@app.route('/check-admin', methods=['POST'])
def check_admin_route():
    return check_admin(request)

# creates a user through the admin console page
@app.route('/create-user', methods=['POST'])
def create_user_route():
    return create_user(request)

# populate dealerships table
@app.route('/user-dealerships', methods=['POST'])
def user_dealerships_route():
    return user_dealerships()

# prepopulate the dealerships table with a .json
@app.route('/prepopulate-dealerships', methods=['POST'])
def prepopulate_dealerships_route():
    return prepopulate_dealerships(request)

# populate user table in admin console
@app.route('/all-users', methods=['POST'])
def all_users_route():
    return all_users()

# delete a user from the list
@app.route('/delete-user', methods=['POST'])
def delete_user_route():
    return delete_user(request)

# edit user role
@app.route('/user-update-values', methods=['POST'])
def user_update_values_route():
    return user_update_values(request)

# delete a dealership from the list
@app.route('/delete-dealership', methods=['POST'])
def delete_dealership_route():
    return delete_dealership(request)

# add dealership to the database
@app.route('/add-dealership', methods=['POST'])
def add_dealership_route():
    return add_dealership(request)
    
# edit dealership uio/sales
@app.route('/dealership-update-values', methods=['POST'])
def dealership_update_values_route():
    return dealership_update_values(request)

# updates the min requirement
@app.route('/submit-min-requirements', methods=['POST'])
def submit_min_requirements_route():
    return submit_min_requirements(request)

# pulls the current min requirements
@app.route('/get_brand_compliance_limits', methods=['GET'])
def get_brand_compliance_limits_route():
    return get_brand_compliance_limits()

#
# Dashboard Related Calls
#
    
# get the recent uploads
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
                given_datetime = datetime.strptime(submitted, "%Y-%m-%dT%H:%M:%S.%fZ")
                current_datetime = datetime.utcnow()
                time_difference = current_datetime - given_datetime

                # Check if the time difference is less than 24 hours
                if time_difference < timedelta(hours=24):
                    result_str = f"{name}: {upload}"
                    submitted_list.append(result_str)

    return jsonify(submitted_list)

# get the top 25 dealerships
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

# get the names of dealership
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
                averages['Emotional Avg'].append(round(sum(score[5] for score in scores_list) / num_scores,2))

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
                averages['Emotional Avg'].append(round(sum(score[5] for score in scores_list) / num_scores,2))

    print(averages)

    return jsonify(averages)

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
