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

car_brands = ['Audi', 'BMW', 'Cadillac', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Kia', 
              'Mercedes', 'Porsche', 'Subaru', 'Toyota', 'Volkswagen']

class LogoDetector:
    def __init__(self, filePath, confidence_threshold=0.6, nms_threshold=0.4):
        self.confidence_threshold = confidence_threshold  # Set confidence threshold for detection
        self.nms_threshold = nms_threshold  # Set Non-Maximum Suppression threshold
        self.logos = None
        self.annotations = []
        self.filePath = f"{filePath[0]}/{filePath[1]}/{filePath[2]}/{filePath[4]}/LogoResults"
        print(self.filePath)
        # Initialize Firebase Admin SDK with your credentials
        self.bucket = storage.bucket()


    # Runs the Cloud Vision API and if the confidence level is over 0.5, will annotate and store image
    def detect_logos_image(self,image_path):
        """Detect logos in an image."""
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
        
        response = client.logo_detection(image=image)
        self.logos = response.logo_annotations
        print("Logos:")

        if self.logos == []:
            detected_logo = "No Detection"
            return detected_logo
        
        else:
            for logo in self.logos:
                print(logo.description)
                annotated_image = self.create_annotated_image(image_path, logo)
                self.save_annotated_image_to_firebase(annotated_image)

                detected_logo = logo.description

                # Make the brand detection consistent / redact to brand name only
                for brand in car_brands:
                    if detected_logo.lower() == brand.lower() or brand.lower() in detected_logo.lower():
                        detected_logo = brand
                        break

                return detected_logo


    # Creates the annotated images using pillow to find vertices of logo and create a bounding box with text
    def create_annotated_image(self,image_path, logo):
        """Creates an annotated image with bounding boxes around logos."""
        # Open the original image using PIL
        with Image.open(image_path) as image:
            draw = ImageDraw.Draw(image)

            # Get bounding box vertices
            vertices = [(vertex.x, vertex.y) for vertex in logo.bounding_poly.vertices]

            # Check if vertices contain exactly 4 coordinates
            if len(vertices) != 4:
                raise ValueError("Coordinate list must contain exactly 4 coordinates")

            # Extract top-left and bottom-right vertices
            top_left = vertices[0]
            bottom_right = vertices[2]

            # Draw a rectangle around the logo
            draw.rectangle([top_left, bottom_right], outline="red")

            # Convert PIL image back to OpenCV format
            annotated_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        return annotated_image
    

    # Modify the function to upload files to Firebase Storage
    def save_annotated_image_to_firebase(self, annotated_image):
        print("Saving annotated image to Firebase")
        # Specify the path where you want to store the file in Firebase Storage
        image_filename = f"{self.filePath}/annotated_image_{int(time.time())}.png"
        blob = self.bucket.blob(image_filename)
        # Convert the OpenCV image to bytes
        _, buffer = cv2.imencode('.png', annotated_image)
        # Upload the file to Firebase Storage
        blob.upload_from_string(buffer.tobytes(), content_type='image/png')
        print(f'Saved annotated image to Firebase Storage: {blob.public_url}')