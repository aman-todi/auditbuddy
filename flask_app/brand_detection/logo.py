from flask import current_app as app, jsonify, render_template, redirect, request
from google.cloud import vision
import os
import cv2
import time
import numpy as np
from PIL import Image, ImageDraw


class LogoDetector:
    def __init__(self, confidence_threshold=0.6, nms_threshold=0.4):
        self.confidence_threshold = confidence_threshold  # Set confidence threshold for detection
        self.nms_threshold = nms_threshold  # Set Non-Maximum Suppression threshold
        self.logos = None
        self.annotations = []


    # Runs the Cloud Vision API and if the confidence level is over 0.5, will annotate and store image
    def detect_logos_image(self,image_path):
        """Detect logos in an image."""
        client = vision.ImageAnnotatorClient()

        with open(image_path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)

        response = client.logo_detection(image=image)
        self.logos = response.logo_annotations
        print("Logos:")

        for logo in self.logos:
            print(logo.description)
            print(logo.score)
            if logo.score > 0.5:
                annotated_image = self.create_annotated_image(image_path, logo)
                self.save_annotated_image_locally(annotated_image)


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

            # Annotate the image with the logo description and score
            text = f"{logo.description} (Score: {logo.score})"
            draw.text((top_left[0], top_left[1] - 15), text, fill="red")

            # Convert PIL image back to OpenCV format
            annotated_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        return annotated_image
        
    # Saves the annotated images to local file
    def save_annotated_image_locally(self,annotated_image):
        print("Saving annotated image")
        save_folder = os.path.join(app.root_path, 'static', 'main', 'annotated_images')
        os.makedirs(save_folder, exist_ok=True)

        image_filename = f"annotated_image_{int(time.time())}.png"
        image_path = os.path.join(save_folder, image_filename)
        cv2.imwrite(image_path, annotated_image)

        print(f'Saved annotated image: {image_path}')




