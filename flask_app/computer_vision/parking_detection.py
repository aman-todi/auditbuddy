from roboflow import Roboflow
rf = Roboflow(api_key="08eejFeNCBXzo07TlLQP")
project = rf.workspace().project("parking-space-ipm1b")
model = project.version(4).model

def detect_parking_spaces(image_path):
    # Utilize Roboflow to detect parking spaces in an image
    out = model.predict(image_path, confidence=40, overlap=30).json()

    boxes = []
    for p in out['predictions']:
        boxes.append((p['x'], p['y'], p['width'], p['height']))

    return boxes