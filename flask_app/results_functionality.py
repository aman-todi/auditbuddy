from firebase_admin import storage, firestore
from flask import jsonify
import concurrent.futures
from dateutil import parser

# Firestore database
db = firestore.client()

#
# pulls all results from the database
#
def generate_results(request):

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
    

#
# search for a result
#
def search_results(request):
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