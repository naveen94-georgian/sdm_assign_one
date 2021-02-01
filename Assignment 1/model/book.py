from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps

class Book:
    def __init__(self):
        CONN_STR = 'mongodb+srv://navdb:nav123@cluster0.dnpkj.mongodb.net/?retryWrites=true&w=majority'
        self.mongo_client = MongoClient(CONN_STR)
        self.amazon_db = self.mongo_client['smd_amazon_db']
        self.smd_amazon_col = self.amazon_db['smd_amazon_col']

    def __enter__(self):
        return self

    def get_all(self):
        documents = self.smd_amazon_col.find({})
        data = [doc for doc in documents]
        json_data = [dumps(doc) for doc in data]
        return data, json_data

    def insertDocument(self, doc):
        self.smd_amazon_col.insert_one(doc)

    def deleteDocument(self, objectId):
        self.smd_amazon_col.delete_one({'_id': ObjectId(objectId)})

    def updateDocument(self, objectId, data):
        upd_data = {"$set": {item: data[item] for item in data if item != '_id'}}
        self.smd_amazon_col.update_one({'_id': ObjectId(objectId)}, upd_data)

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.mongo_client.close()

    



# from mongoengine import *

# # Creates a connection to the mongodb database.
# connect(
#     host='mongodb+srv://navdb:nav123@cluster0.dnpkj.mongodb.net/smd_amazon_db'
# )

# """
# The smd_amazon_col class creates a model for the collection in the mongodb database.
# """
# class smd_amazon_col(Document):
#     _id = ObjectIdField()
#     rank = IntField()
#     title = StringField(max_length=300)
#     author = StringField()
#     format = StringField()
#     price = StringField()
#     rating= StringField(default='0.0 out of 5 stars')
#     num_of_reviews = StringField(default='0')
#     img_name = StringField(default='')
