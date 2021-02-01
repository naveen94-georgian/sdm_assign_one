from flask import Blueprint, render_template, request, make_response, jsonify
from model.book import Book
import tempfile

"""
Creates blueprint to register CRUD endpoints.
"""
views = Blueprint('views', __name__, static_folder="static")

def get_item():
    """
    renders the item.html file
    """
    with Book() as book:
        books, json_data = book.get_all()
    return render_template('item.html', books = books, json_data=json_data)

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
    with Book() as book:
        books, json_data = book.get_all()
    item = get_item()
    return render_template('index.html', books = books, item=item, json_data= json_data)

@views.route('/create_data', methods=["POST"])
def create_data():
    """
    Creates a new document in the mongodb database.
    """
    json_data = request.get_json()
    with Book() as book:
        book.insertDocument(json_data)
    return make_response(jsonify({'req': ''}), 200)

@views.route('/delete_data', methods=["POST"])
def delete_data():
    """
    Deletes a document in the mongodb database.
    """
    json_data = request.get_json()
    _id=json_data['_id']['$oid']
    with Book() as book:
        book.deleteDocument(_id)
    return make_response(jsonify({'req': ''}), 200)

@views.route('/update_data', methods=["POST"])
def update_data():
    """
    Updates a document in the mongodb database.
    """
    json_data = request.get_json()
    _id=json_data['_id']['$oid']
    with Book() as book:
        book.updateDocument(_id, json_data)
    return make_response(jsonify({'req': ''}), 200)
