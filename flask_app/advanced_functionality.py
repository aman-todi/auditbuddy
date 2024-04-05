from firebase_admin import storage, firestore
from flask import jsonify
import os

# cloud storage bucket where images are stored
bucket = storage.bucket()

# Firestore database
db = firestore.client()

#
# get the category eval
#
def get_category_eval(request):
    # get the submission
    submission = request.form['submission']
    name = request.form['name']
    department = request.form['department']

    # results collection
    collection_ref = db.collection('results')

    # dealership doc
    dealership_ref = collection_ref.document(name)

    # department collection
    department_ref = dealership_ref.collection(department)

    #submission document
    submission_ref = department_ref.document(submission)

    # get submission data
    if submission_ref.get().exists:
        submission_data = submission_ref.get().to_dict()

        return jsonify(submission_data), 200
       
    else:
        return jsonify({"error": "Submission not found"}), 404

#
# extracts annotated image from corresponding path
#
def get_annotated_images(brandName,dealershipName,department,submission, path):
    try:
        # Construct the folder path based on the dealershipName
        folder_path = f'{brandName}/{dealershipName}/{department}/{submission}' + path
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

#
# deletes a submission from the list
#
def delete_submission(request):

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
        
    return jsonify("success"), 200

#
# update the detection values in the submission
#
def submission_update_values(request):
    # get form inputs
    new_cars = request.form['cars']
    new_logo = request.form['logo']
    new_parking = request.form['parking']
    new_hospitality = request.form['hospitality']
    new_spatial = request.form['spatial']
    emotion = request.form['emotion']

    new_detection = [new_logo, new_cars, new_parking, new_hospitality, new_spatial, emotion]

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
    # extract results from various evaluations to build results
    detected_logo = new_detection[0]
    num_cars = float(new_detection[1])
    num_parking = float(new_detection[2])
    num_seating = float(new_detection[3])
    sq_footage = round(float(new_detection[4]),2)
    satisfaction_score = 0
    if satisfaction_score != 'null':
        satisfaction_score = int(new_detection[5])

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

            # ratios to use
            cars_ratio = 0.005
            parking_ratio = 0.007
            seating_ratio = 0.004
            sq_footage_ratio = .025

            # Grade the evaluation results using past sales and UIO information
            eval_factor = (past_sales + uio)//2
            minParkingFactor = int(num_parking)/int(parking_min) + 1
            minCarFactor = int(num_cars)/int(cars_min)+1
            minSeatingFactor = int(num_seating)/int(seating_min) +1
            minSqFactor = float(sq_footage)/float(sq_footage_min) +1
            grades = {}

            # Logo detection results
            if detected_logo.upper() == brand.upper():
                logo_result = ('Great', 4, detected_logo)
            else:
                logo_result = ('Poor', 1, detected_logo)

            grades['Logo'] = logo_result

            # Cars display results
            if num_cars < cars_min:
                cars_result = ('Poor', 1, num_cars)

            elif num_cars < cars_min+(eval_factor*cars_ratio*minCarFactor):
                cars_result = ('Unsatisfactory', 2, num_cars)

            elif num_cars == cars_min+(eval_factor*cars_ratio*minCarFactor) or cars_min+(eval_factor*cars_ratio*minCarFactor*2):
                cars_result = ('Good', 3, num_cars)

            elif num_cars >= cars_min+(eval_factor*cars_ratio*minCarFactor*2):
                cars_result = ('Great', 4, num_cars)

            min_vals = (cars_min,round(cars_min+(eval_factor*cars_ratio*minCarFactor),2),round(cars_min+(eval_factor*cars_ratio*minCarFactor*2),2))
            cars_result = cars_result + min_vals
            grades['Cars'] = cars_result 

            # Customer parking results
            if num_parking < parking_min:
                parking_result = ('Poor', 1, num_parking)

            elif num_parking < parking_min+(eval_factor*parking_ratio*minParkingFactor):
                parking_result = ('Unsatisfactory', 2, num_parking)

            elif num_parking == parking_min+(eval_factor*parking_ratio*minParkingFactor) or parking_min+(eval_factor*parking_ratio*minParkingFactor*2):
                parking_result = ('Good', 3, num_parking)

            elif num_parking >= parking_min+(eval_factor*parking_ratio*minParkingFactor*2):
                parking_result = ('Great', 4, num_parking)

            min_vals = (parking_min,round(parking_min+(eval_factor*parking_ratio*minParkingFactor),2),round(parking_min+(eval_factor*parking_ratio*minParkingFactor*2),2))
            parking_result = parking_result + min_vals
            grades['Parking'] = parking_result

            # Hospitality results
            if num_seating < seating_min:
                seating_result = ('Poor', 1, num_seating)

            elif num_seating < seating_min+(eval_factor*seating_ratio*minSeatingFactor):
                seating_result = ('Unsatisfactory', 2, num_seating)

            elif num_seating == seating_min+(eval_factor*seating_ratio*minSeatingFactor) or num_seating < seating_min+(eval_factor*seating_ratio*minSeatingFactor*2):
                seating_result = ('Good', 3, num_seating)

            elif num_seating >= seating_min+(eval_factor*seating_ratio*minSeatingFactor*2):
                seating_result = ('Great', 4, num_seating)

            min_vals = (seating_min,round(seating_min+(eval_factor*seating_ratio*minSeatingFactor),2),round(seating_min+(eval_factor*seating_ratio*minSeatingFactor*2),2))
            seating_result = seating_result + min_vals
            grades['Hospitality'] = seating_result

            # Square footage results
            if sq_footage < sq_footage_min:
                sq_footage_result = ('Poor', 1, sq_footage)

            elif sq_footage < sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor):
                sq_footage_result = ('Unsatisfactory', 2, sq_footage)

            elif sq_footage == sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor) or sq_footage < sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2):
                sq_footage_result = ('Good', 3, sq_footage)

            elif sq_footage >= sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2):
                sq_footage_result = ('Great', 4, sq_footage)
                
            
            print("Test SQ FT", sq_footage_result)
            min_vals = (round(sq_footage_min,2),round(sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor),2),round(sq_footage_min+(eval_factor*sq_footage_ratio* minSqFactor *2),2))
            sq_footage_result = sq_footage_result + min_vals
            grades['Spatial'] = sq_footage_result

            # check if emotion was uploaded
            if satisfaction_score != "null":
                # emotional results
                if satisfaction_score < 0:
                    emotion = ('Poor', 1, satisfaction_score)
                elif satisfaction_score >= 0 and satisfaction_score < 1:
                    emotion = ('Unsatisfactory', 2, satisfaction_score)
                elif satisfaction_score >= 1:
                    emotion = ('Good', 3, satisfaction_score)
                elif satisfaction_score >= 2:
                    emotion = ('Great', 3, satisfaction_score)
    
            print("Test SQ FT", sq_footage_result)

            if satisfaction_score < 0:
                emotion = ('Poor', 1, satisfaction_score)
            elif satisfaction_score >= 0 and satisfaction_score < 1:
                emotion = ('Unsatisfactory', 2, satisfaction_score)
            elif satisfaction_score >= 1:
                emotion = ('Good', 3, satisfaction_score)
            elif satisfaction_score >= 2:
                emotion = ('Great', 3, satisfaction_score)

            min_vals = ("Below Zero","Between 0 and 2","Over 2")
            emotion = emotion + min_vals
            grades['Emotional'] = emotion

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
        categories = ['Logo', 'Cars', 'Parking', 'Hospitality', 'Spatial', 'Emotional']
        scores = [grades[category][1] for category in categories]

        grades = calculate_evaluation_grades()

        return [scores, categories, total_score]