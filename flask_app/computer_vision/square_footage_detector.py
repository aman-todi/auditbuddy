import cv2
import numpy as np
import imutils
from PIL import Image

# The distance in inches used for the callibration image
callibration_distance = 36.0
# The width of the reference image in inches
reference_obj_width = 18.0
         
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
    # draw a box around the image
    box = cv2.cv.BoxPoints(image) if imutils.is_cv2() else cv2.boxPoints(marker)
    box = np.intp(box)
    cv2.drawContours(image, [box], -1, (0, 0, 255), 2)
    cv2.putText(image, "%.2fft" % (inches / 12),
        (image.shape[1] - 200, image.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX,
        2.0, (0, 255, 0), 3)

def compute_square_footage(files):

    distances_list = []
    square_footage_estimate = 0.0
    for file in files:
        print(file)
        # Convert images to .PNG
        im = Image.open(file)
        im.save(file, "png")

    cal_index = files.find("callibration.png")
    cal_image = cv2.imread(files[cal_index])
    marker = find_reference(cal_image)
    print("Callibration Stats")
    print("Pixels ", marker[1][0])
    print("Inches ", inches)
    print("FOCAL LENGTH:", focalLength)

    # compute the focal length from the callibration image 
    focalLength = (marker[1][0] * callibration_distance) / reference_obj_width
    inches = compute_distance(reference_obj_width, focalLength, marker[1][0])
    files.remove(cal_index)
    for file in files:
        img = cv2.imread(file)
        marker = find_reference(img)
        dist = compute_distance(reference_obj_width, focalLength, marker)
        distances_list.append(dist)
        print("Image Statistics")
        print("Pixels ", marker[1][0])
        print("Inches:", dist)
        # Save the annotated image somehow that comes from this function
        draw_box(file, marker, inches)
        len_ft = distances_list[0] / 12
        wi_ft = distances_list[1] / 12
        square_footage_estimate = len_ft * wi_ft



