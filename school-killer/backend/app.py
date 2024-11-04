from flask import Flask, request, session, jsonify, render_template
from flask_cors import CORS
from google.cloud import vision, storage
import uuid

app = Flask(__name__, template_folder='../templates', static_folder='../test/static')
app.secret_key = '$#F$RGgnrgwokn'
CORS(app, supports_credentials=True)

vision_client = vision.ImageAnnotatorClient()
storage_client = storage.Client()
bucket_name = "schoolkiller-images"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('file')
    if not files:
        return jsonify({'error': 'No selected files'}), 400

    user_id = str(uuid.uuid4())
    session['user_id'] = user_id
    print(f"Uploaded user_id stored in session: {session['user_id']}")  # Отладка


    bucket = storage_client.get_bucket(bucket_name)
    image_urls = []

    for file in files:
        blob = bucket.blob(f"{user_id}/{file.filename}")
        blob.upload_from_file(file)
        image_url = f"https://storage.googleapis.com/{bucket_name}/{user_id}/{file.filename}"
        image_urls.append(image_url)

    return jsonify({'user_id': user_id, 'success': 'Files uploaded successfully', 'image_urls': image_urls})

@app.route('/perform_ocr', methods=['POST'])
def perform_ocr():
    data = request.get_json()
    user_id = data.get('user_id') if data else None

    if not user_id and 'user_id' in session:
        user_id = session['user_id']

    if not user_id:
        return jsonify({'error': 'No user_id provided or session found'}), 400

    bucket = storage_client.get_bucket(bucket_name)
    blobs = list(bucket.list_blobs(prefix=f"{user_id}/"))

    if not blobs:
        return jsonify({'error': 'No images to process for the provided user_id'}), 400

    extracted_texts = []
    for blob in blobs:
        image = vision.Image()
        image.source.image_uri = f"gs://{bucket_name}/{blob.name}"
        response = vision_client.text_detection(image=image)

        texts = response.text_annotations
        extracted_text = texts[0].description if texts else "No text detected."
        extracted_texts.append(extracted_text)

    session.pop('user_id', None)

    return jsonify({'extracted_text': "\n\n".join(extracted_texts)})

if __name__ == '__main__':
    app.run(debug=True)