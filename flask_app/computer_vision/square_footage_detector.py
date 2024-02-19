import cv2
import numpy as np
import imutils
from flask import jsonify
import os
from werkzeug.utils import secure_filename
from flask import current_app as app
from PIL import Image, ExifTags

# The distance in inches used for the callibration image
callibration_distance = 36.0
# The width of the reference image in inches
reference_obj_width = 18.0

# Function to remove EXIF rotation metadata
def remove_exif_orientation(image):
    for orientation in ExifTags.TAGS.keys():
        if ExifTags.TAGS[orientation] == 'Orientation':
            break
    exif = dict(image._getexif().items())

    if orientation in exif:
        if exif[orientation] == 3:
            image = image.rotate(180, expand=True)
        elif exif[orientation] == 6:
            image = image.rotate(270, expand=True)
        elif exif[orientation] == 8:
            image = image.rotate(90, expand=True)
    return image

# Finds the poster board in an image and deterimnes where the bounds of it are
def find_reference(image):

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Bounding range for detecting green pixels in the image
    lower_green = np.array([40, 40, 40])
    upper_green = np.array([80, 255, 255])

    mask = cv2.inRange(hsv, lower_green, upper_green)

    mask = cv2.erode(mask, None, iterations=2)
    mask = cv2.dilate(mask, None, iterations=2)

    cnts = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    c = max(cnts, key=cv2.contourArea)

    return cv2.minAreaRect(c)

# Uses the focalLength calculated from the Callibration image to find the width in pixels in a new image
def compute_distance(knownWidth, focalLength, perWidth):
    return (knownWidth * focalLength) / perWidth

def draw_box(image, marker, inches):
    # Make a copy of the input image to avoid modifying the original image
    annotated_image = image.copy()

    # Draw a box around the image
    box = cv2.boxPoints(marker)
    box = np.intp(box)
    cv2.drawContours(annotated_image, [box], -1, (0, 0, 255), 2)
    cv2.putText(annotated_image, "%.2fft" % (inches / 12),
                (annotated_image.shape[1] - 230, annotated_image.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX,
                2.0, (0, 255, 0), 2)
    
    return annotated_image

def resize_image(image_path, max_dimension=1000):
    # Read the image
    image = cv2.imread(image_path)
    
    # Get the dimensions of the image
    height, width = image.shape[:2]
    
    # Check if the image needs resizing
    if height > max_dimension or width > max_dimension:
        # Calculate the scaling factor to resize the image while preserving aspect ratio
        if height > width:
            scale_factor = max_dimension / height
        else:
            scale_factor = max_dimension / width
        
        # Resize the image
        resized_image = cv2.resize(image, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_AREA)
        
        return resized_image
    else:
        # Return the original image if it doesn't need resizing
        return image
def compute_square_footage(files):
    distances_images = []
    square_footage_estimate = 0.0
    counter = 1
    for file in files:
        
        print(file)
        path = os.path.join("flask_app", "static", "main", "media", file)
        # Convert image to .PNG
        im = Image.open(path)
        im.save(file, "png")
        
        # The image sometimes gets rotated when being converted
        exif = im._getexif()
        if exif is not None:
            im = remove_exif_orientation(im)

        # Save the converted image in PNG format with a new filename

        if file[-3:] != "png":
            png_filename = os.path.splitext(file)[0] + ".png"
            png_save_path = os.path.join("flask_app", "static", "main", "media", png_filename)
            im.save(png_save_path, "PNG")
            distances_images.append(png_filename)
            os.remove(path)
        else:
            distances_images.append(file)
        
    try:
        cal_index = distances_images.index("calibration.png")
        print(cal_index)
    except ValueError:
        return -1.0
    

    cal_image = resize_image(files[cal_index])
    marker = find_reference(cal_image)
    
    # compute the focal length from the callibration image 
    focalLength = (marker[1][0] * callibration_distance) / reference_obj_width
    inches = compute_distance(reference_obj_width, focalLength, marker[0][1])
    
    distances_list = []
    for file in distances_images:
        new_path = os.path.join("flask_app", "static", "main", "media", file)
        print("file in distance images")
        print(file)
        if file == distances_images[cal_index]:
            continue
        print("trying to read path: ")
        print(new_path)
        img = resize_image(new_path)
        marker = find_reference(img)
        dist = compute_distance(reference_obj_width, focalLength, marker[1][0])
        distances_list.append(dist)
        
        # Save the annotated image somehow that comes from this function
        annotated_image = draw_box(img, marker, dist)
        annotated_path = os.path.join("flask_app", "static", "main", "annotated_images",f"annotated_image_{counter}.png")
        cv2.imwrite(annotated_path, annotated_image)
        counter += 1 
    len_ft = distances_list[0] / 12
    wi_ft = distances_list[1] / 12
    square_footage_estimate = len_ft * wi_ft
    
    return square_footage_estimate


