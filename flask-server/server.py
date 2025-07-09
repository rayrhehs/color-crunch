from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from scripts.random_image_generator import random_generator
from scripts.test_generator import test_generator
from utils.helpers import open_image
from supabase import create_client
import io
import os

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

app = Flask(__name__)   
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # enable CORS for all routes so I don't see an error when sending requests to backend 

# datatbase password: XbJMDEPlNFcdmOGB

@app.route("/generate", methods=['POST'])
def generate_new_image():
    # destructure image property from the request object 
    uploaded_file = request.files["image"]
    # open image inside of PIL so that it is accessible to library
    image = open_image(uploaded_file)
    # make modifications to image
    processed_image = random_generator(image)
    # creates an in-memory binary stream that temporarily creates an object in RAM that acts like one stored on the disk
    image_io = io.BytesIO()
    # save processed image
    processed_image.save(image_io, format="PNG")
    # reset pointer to start of the file
    image_io.seek(0) 

    # send processed image back to frontend
    return send_file(image_io, mimetype="image/png")

@app.route("/generate-modified", methods=['POST'])
def generate_modified_image():
    uploaded_file = request.files["image"]
    image = open_image(uploaded_file)
    processed_image_details = test_generator(image)


    return jsonify({"pixels": processed_image_details})


if __name__ == "__main__":
    app.run(debug=True)





    