from flask import Blueprint, render_template, request, make_response, jsonify
from model.book import smd_amazon_col
import tempfile

"""
Creates blueprint to register CRUD endpoints.
"""
views = Blueprint('views', __name__, static_folder="static")

def get_item():
    """
    renders the item.html file
    """
    books = smd_amazon_col.objects
    return render_template('item.html', books = books)

@views.route('/reload')
def reload():
    """
    returns the reloaded DOM string.
    """
    return get_item()

@views.route('/')
def index():
    """
    renders the homepage.
    """
    books = smd_amazon_col.objects
    item = get_item()
    return render_template('index.html', books = books, item=item)

@views.route('/create_data', methods=["POST"])
def create_data():
    """
    Creates a new document in the mongodb database.
    """
    json_data = request.get_json()
    book = smd_amazon_col(title=json_data['title'],author=json_data['author'],format=json_data['format'],price=json_data['price'])
    book.save()
    return make_response(jsonify({'req': ''}), 200)

@views.route('/delete_data', methods=["POST"])
def delete_data():
    """
    Deletes a document in the mongodb database.
    """
    json_data = request.get_json()
    book = smd_amazon_col.objects(_id=json_data['_id']['$oid'])
    print(book)
    book.delete()
    return make_response(jsonify({'req': ''}), 200)

@views.route('/update_data', methods=["POST"])
def update_data():
    """
    Updates a document in the mongodb database.
    """
    json_data = request.get_json()
    book = smd_amazon_col.objects(_id=json_data['_id']['$oid'])
    book.update(title=json_data['title'],author=json_data['author'],format=json_data['format'],price=json_data['price'])
    return make_response(jsonify({'req': ''}), 200)
