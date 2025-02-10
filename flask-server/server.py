from flask import Flask
from flask import request
from flask_cors import CORS
from algorithms.random_image_generator import random_generator

app = Flask(__name__)
CORS(app)  # enable CORS for all routes so I don't see an error when sending requests to backend


@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

@app.route("/test", methods=['POST'])
def test():
    jsonData = request.get_json()
    return jsonData['message']


@app.route("/generate", methods=['POST'])
def generate_new_imag():
    return
    # image2 = random_generator(image1)


if __name__ == "__main__":
    app.run(debug=True)