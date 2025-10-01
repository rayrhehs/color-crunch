from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from scripts.random_image_generator import random_generator
from scripts.median_cut import make_pixel_array, reduce_image_size, median_cut, median_swap, reconstruct_image
from utils.helpers import open_image
from utils.colors import palettes
import io
import uuid
import base64

app = Flask(__name__)   
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # enable CORS for all routes so I don't see an error when sending requests to backend 
MAX_FILE_SIZE = 15 * 1024 * 1024

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
    
    if "image" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
    
    uploaded_file = request.files["image"]
    user_theme = request.form["theme"]
    user_palette_size = request.form["paletteSize"]

    uploaded_file.stream.seek(0, 2) # 
    filesize = uploaded_file.stream.tell()
    uploaded_file.stream.seek(0)

    if (filesize > MAX_FILE_SIZE):
        return jsonify({
            "success": False, 
            "error": "Uploaded image exceeds maximum file size."
        }), 400

    try: 
        image = open_image(uploaded_file)

        reduced_img = reduce_image_size(image)
        pixel_array = make_pixel_array(reduced_img)
        new_palette = median_cut(pixel_array, int(user_palette_size))
        swapped_palette = median_swap(new_palette, palettes[user_theme])
        reconstructed_image = reconstruct_image(reduced_img, pixel_array, swapped_palette)
        
        image_io = io.BytesIO()
        reconstructed_image.save(image_io, format="JPEG")
        image_io.seek(0)

        image_bytes = image_io.getvalue()
        imagesize = len(image_bytes)
        filename = f"modified_image_{uuid.uuid4()}.jpeg"

        image_io.seek(0)

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        response = {
            "success": True,
            "mime": "image/jpeg",
            "filename": filename,
            "imagesize": imagesize,
            "width": image.width,
            "height": image.height,
            "data": image_base64
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)





    