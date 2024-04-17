# Team Urban Science

**AuditBuddy** 
The AuditBuddy application improves upon the audit process done in car dealerships by leveraging computer vision and artificial intelligence to automate the generation of comprehensive dealership evaluation reports.

**Useful Commands**
Web deployed version: auditbuddy.web.app

**Getting Started**
Below are instructions used for setting up this application on a local host. 

1. Clone the repository:
    ```bash
    git clone https://gitlab.msu.edu/tranash31/urban-science.git
    ```
2. Navigate to local directory:
    ```bash
    cd to your local repository
    docker-compose -f docker-compose.yml -p urban-science-container up
    ```
3. Install dependencies:
    ```bash
    cd to react_app
    npm run build - Run this after making changes to App.js
    npm install - Installs any dependencies on your machine from package.json (ex.JQuery)
    ```
4. Build container using Docker:
    ```bash
    docker-compose build --nocache
    docker-compose -f docker-compose.yml -p urban-science-container up
    ```
Login Information
```
auditor: can only access the upload, results
test@email.com:password

admin (dealership manager): can access everything as an auditor
would, but can see the admin console (manage users, manage dealerships), and the dashboard
admin@email.com:password
```


Upload Media Page
```
We have provided files in the test_media folder to test media at your convenience

1. Select the dealership from the pre populated list. If you'd like to add a new dealership, please reference the 'Dealerships Page' section

2. Select the department

3. Give the test upload a name (ex. upload_april_17)

4. Upload media in the respected detection categories. 

NOTE:
Everything is required to upload some files, except 'Emotion', which is optional.

The type of files that can be supported are indicated with the photo/video icons next to the detection name

Press the analyze button. You will see a toast message indicating loading, and will notify you as well when they are done uploading.
```

Manage Dealerships Page: Dealership List
```
You can edit UIO/Sales data by clicking on the table row of the needed dealership.

You can add a new dealership to the system by clicking the 'Add Dealership' button. You can either manually input this data, or use a prepopulated JSON in this format:

[
    {
        "UID": "TEST1",
        "Dealership Name": "Testing Name 1",
        "Brand": "Toyota",
        "City": "Lansing",
        "State": "MI",
        "UIO": 231,
        "Sales": 111,
        "Country": "USA"
    },
    {
        "UID": "TEST2",
        "Dealership Name": "Testing Name 3",
        "Brand": "Chevrolet",
        "City": "Jackson",
        "State": "MI",
        "UIO": 333,
        "Sales": 444,
        "Country": "USA"
    }
]
```




