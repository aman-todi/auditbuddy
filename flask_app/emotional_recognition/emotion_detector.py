from flask import current_app as app, jsonify, render_template, redirect, request
from google.cloud import vision
import firebase_admin
from firebase_admin import storage
from PIL import Image, ImageDraw
import os
from io import BytesIO
import cv2
import time
import numpy as np


def compute_satisfaction(image_path, dealership_info):

    counter = 1
    satisfaction_score = 0.0
    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    # Create an Image object from the byte string
    image = Image.open(BytesIO(content))
    
    # Convert the image to grayscale
    gray_image = image.convert("L")

    # Convert the grayscale image back to a byte string
    buffered = BytesIO()
    gray_image.save(buffered, format="PNG")
    gray_image_bytes = buffered.getvalue()

    image = vision.Image(content=gray_image_bytes)  
    cv_im = cv2.imread(image_path)
       
    response = client.face_detection(image=image)
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    faces = response.face_annotations
    
    # Names of likelihood from google.cloud.vision.enums
    likelihood_name = (
        "UNKNOWN",
        "VERY_UNLIKELY",
        "UNLIKELY",
        "POSSIBLE",
        "LIKELY",
        "VERY_LIKELY",
    )
    
    print("Faces:")
    # Save the frames with top emotion recognition results and compute the grade
    counter = 1
    annotated_image = cv_im.copy()
    face_count = 0
    for face in faces:
        text = ""
        face_count += 1
        if likelihood_name[face.anger_likelihood] == "VERY_LIKELY":
            print("Very Likely an Angry Face Detected")
            text = f"anger: {likelihood_name[face.anger_likelihood]}"
            satisfaction_score -= 2.0
        elif likelihood_name[face.anger_likelihood] == "LIKELY":
            print("Likely an Angry Face Detected")
            text = f"anger: {likelihood_name[face.anger_likelihood]}"
            satisfaction_score -= 1.0
            
        if likelihood_name[face.joy_likelihood] == "VERY_LIKELY":
            print("Very likely a Happy Face Detected")
            text = f"joy: {likelihood_name[face.joy_likelihood]}"
            satisfaction_score += 2.0
        elif likelihood_name[face.joy_likelihood] == "LIKELY":
            print("likely a Happy Face Detected")
            text = f"joy: {likelihood_name[face.joy_likelihood]}"
            satisfaction_score += 1.0
                
        if likelihood_name[face.sorrow_likelihood] == "VERY_LIKELY":
            print("Very likely a Sad Face Detected")
            text = f"sorrow: {likelihood_name[face.sorrow_likelihood]}"
            satisfaction_score -= 2.0
        elif likelihood_name[face.sorrow_likelihood] == "LIKELY":
            print("likely a Sad Face Detected")
            text = f"sorrow: {likelihood_name[face.sorrow_likelihood]}"
            satisfaction_score -= 1.0    

        if likelihood_name[face.surprise_likelihood] == "VERY_LIKELY":
            print("Very Likely Surprised face detected")
            text = f"surprise: {likelihood_name[face.surprise_likelihood]}"
            satisfaction_score += 2.0
        elif likelihood_name[face.surprise_likelihood] == "LIKELY":
            print("Likely Surprised face detected")
            text = f"surprise: {likelihood_name[face.surprise_likelihood]}"
            satisfaction_score += 1.0
        
        if len(text) == 0:
            text = f"Emotion undetermined or Neutral"
            
        # Get bounding box vertices
        vertices = [(vertex.x, vertex.y) for vertex in face.bounding_poly.vertices]

        # Check if vertices contain exactly 4 coordinates
        if len(vertices) != 4:
            raise ValueError("Coordinate list must contain exactly 4 coordinates")

        # Extract top-left and bottom-right vertices
        top_left = vertices[0]
        bottom_right = vertices[2]

        # Draw a rectangle around the face
        cv2.rectangle(annotated_image, top_left, bottom_right, (0, 0, 255), 2)

        # Calculate the position for the text
        text_x = max(0, top_left[0] - 10)
        text_y = max(0, top_left[1] - 10)

        # Add text to the image
        cv2.putText(annotated_image, text, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)

    
    # Save annotated image
    save_annotated_image_to_firebase(annotated_image,dealership_info,counter)
    counter += 1

    # New grading implements an average based on the total number of faces
    # satisfaction_score < -1 is Poor
    # -1 <= satisfaction_score < 0: Unsatisfactory
    # 0 <= satisfaction_score < 1: Satisfactory
    # 1 < satisfaction_score: Exceptional
    return satisfaction_score / face_count

def save_annotated_image_to_firebase(annotated_image,dealership_info,counter):
    print("Saving annotated image to Firebase")
    # Specify the path where you want to store the file in Firebase Storage
    image_filename = f"{dealership_info[0]}/{dealership_info[1]}/{dealership_info[2]}/{dealership_info[4]}/EmotionalResults/annotated_image_{counter}.png"
    blob = storage.bucket().blob(image_filename)
    # Convert the OpenCV image to bytes
    _, buffer = cv2.imencode('.png', annotated_image)
    # Upload the file to Firebase Storage
    blob.upload_from_string(buffer.tobytes(), content_type='image/png')
    print(f'Saved annotated image to Firebase Storage: {blob.public_url}')
