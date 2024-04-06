from flask import jsonify
from firebase_admin import auth, firestore
import json
import concurrent.futures

# access firestore
db = firestore.client()

##################################
# MIN REQUIREMENTS
##################################

#
# updates the min requirements
#
def submit_min_requirements(request):
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

#
# get the current min requirements
#
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

##################################
# USERS
##################################

#
# checks if a user is an admin
#
def check_admin(request):
    # get the user email
    token = request.json.get('userToken')

    # get the admins database
    db = firestore.client()
    collection_ref = db.collection('admins')
    # find the document with the user's email
    user_doc = collection_ref.document(token).get()

    # if present, then the user is an admin
    if user_doc.exists:
        return jsonify({'isAdmin': True}), 200

    return jsonify({'isAdmin': False}), 200

#
# creates a user through the admin console page
#
def create_user(request):
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
     
        return jsonify({'email': user.email}), 200  # user email upon success
    except Exception as e:
        return jsonify({'error': str(e)}), 400  # error
    
#
# populate user table in admin console
#
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
def delete_user(request):
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

        
    return jsonify("success"), 200

#
# edit user role
#
def user_update_values(request):
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


##################################
# DEALERSHIPS
##################################
    
#
# populate dealerships table
#
def user_dealerships():
    # access the database
    collection_ref = db.collection('dealerships')

    # extract the data from database and put dict in list
    docs = [doc.to_dict() for doc in collection_ref.stream()]

    return jsonify(docs)

#
# prepopulate the dealerships table with a .json
#
def prepopulate_dealerships(request):

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

                    # insert this data into the dealerships table
                    db.collection("dealerships").document(dealership['UID']).set(data)

        except Exception as e:
            error_message = f"Error during {category} processing: {str(e)}"
            print(error_message)
            return jsonify({'error': error_message}), 500

        index += 1


    return jsonify("success"), 200

#
# delete a dealership from the list
#
def delete_dealership(request):
    # get dealership info
    uid = request.form['uid']

    # go to dealerships table in db
    collection_ref = db.collection('dealerships')

    # search the dealerships for the field uid
    dealership_doc = collection_ref.document(uid).get()

    # if present, then we delete the dealership
    if dealership_doc.exists:
        dealership_doc.reference.delete()
        
    return jsonify("success"), 200

#
# add dealership to the database
#
def add_dealership(request):
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
def dealership_update_values(request):
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
    