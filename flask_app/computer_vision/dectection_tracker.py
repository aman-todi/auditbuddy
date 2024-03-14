# Tracker classes to track object detections across frames in a video

import numpy as np
import copy

class Yolov3_Tracker:
    # allow user to customize the distance threshold depending on the object size
    def __init__(self, distance_threshold=170):
        self.next_id = 0
        self.objects = {}  # Stores object ID and its centroid
        self.distance_threshold = distance_threshold  # Threshold for considering object as matched

    def update(self, boxes):

        # Update the tracker based on detected boxes
        for box in boxes:
            # Calculate the centroid of the new detection
            x, y, w, h = box
            centroid = (int(x + w / 2), int(y + h / 2))

            avg_side = (w+h)/2

            # If there are no objects currently tracked, add this as a new object
            if not self.objects: 
                self.objects[self.next_id] = centroid
                self.next_id += 1
                continue

            # Check if the new detection matches any existing tracked objects
            if not any(np.linalg.norm(np.array(obj_centroid) - np.array(centroid)) < self.distance_threshold * (avg_side/125)
                       for obj_centroid in self.objects.values()):
                
                # If the object does not match existing objects, consider it as a new distinct object
                self.objects[self.next_id] = centroid
                self.next_id += 1
        
        return

    def get_total_count(self):
        # Return the total number of distinct objects detected throughout the video
        return self.next_id
    

class Yolov5_Tracker:
    # allow user to customize the distance threshold depending on the object size
    def __init__(self):
        self.next_id = 0
        self.objects = {}  # Stores object ID and its centroid
        self.box_life = 30 # Mitigates temporary detection failures (30, 31 are good)

    def update(self, boxes):
        # Update the tracked detections
        updated_objects = {}

        for box in boxes:
            # Calculate the centroid of the new detection
            x, y, w, h = box
            centroid = (int(x + w / 2), int(y + h / 2))

            avg_side = (w+h)/2
            distance_threshold = avg_side/2

            # If there are no objects currently tracked, add this as a new object
            if not self.objects: 
                updated_objects[self.next_id] = [centroid, self.box_life]
                self.next_id += 1
                continue

            # Find the closest object to the current box
            distances = {obj_id: np.linalg.norm(np.array(obj_centroid) - np.array(centroid))
                        for obj_id, (obj_centroid, _) in self.objects.items()}
            
            closest_obj_id, closest_distance = min(distances.items(), key=lambda x: x[1])

            # Check if the new detection matches any existing tracked object
            if closest_distance < distance_threshold:
                updated_objects[closest_obj_id] = [centroid, self.box_life]
                del self.objects[closest_obj_id]

            # If the object does not match existing objects, consider it a new distinct object
            else:
                updated_objects[self.next_id] = [centroid, self.box_life]
                self.next_id += 1

        # Transfer remaining detections which still have some life left
        for key in self.objects:
            if self.objects[key][1] > 1:
                updated_objects[key] = self.objects[key]

        # Delete the boxes which have expired
        for key in updated_objects:
            updated_objects[key][1] -= 1
        
        self.objects = updated_objects
        
        return

    def get_total_count(self):
        # Return the total number of distinct objects detected throughout the video
        return self.next_id

