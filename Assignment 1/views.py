from flask import Blueprint, render_template, request, make_response, jsonify
from model.book import smd_amazon_col
import tempfile

views = Blueprint('views', __name__, static_folder="static")

@views.route('/')
def index():
    return render_template('index.html', books = smd_amazon_col.objects)

@views.route('/update_data', methods=["POST"])
def update_data():
    json_data = request.get_json()
    id = json_data['id'].strip()
    print('json_data: ', json_data)
    # book = smd_amazon_col.from_json(json_data)
    book = smd_amazon_col.objects(_id=id)
    print(book)
    
    return make_response(jsonify({'req': ''}), 200)
