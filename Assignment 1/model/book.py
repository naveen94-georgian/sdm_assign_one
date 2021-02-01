from mongoengine import *

# Creates a connection to the mongodb database.
connect(
    host='mongodb+srv://navdb:nav123@cluster0.dnpkj.mongodb.net/smd_amazon_db'
)

"""
The smd_amazon_col class creates a model for the collection in the mongodb database.
"""
class smd_amazon_col(Document):
    _id = ObjectIdField()
    rank = IntField()
    title = StringField(max_length=300)
    author = StringField()
    format = StringField()
    price = StringField()
    rating= StringField(default='0.0 out of 5 stars')
    num_of_reviews = StringField(default='0')
    img_name = StringField(default='')
