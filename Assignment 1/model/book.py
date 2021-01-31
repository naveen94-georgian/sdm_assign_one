from mongoengine import *
connect(
    host='mongodb+srv://navdb:nav123@cluster0.dnpkj.mongodb.net/smd_amazon_db'
)

class smd_amazon_col(Document):
    _id = ObjectIdField()
    rank = IntField()
    title = StringField(max_length=300)
    author = StringField()
    format = StringField()
    price = StringField()
    rating= StringField(default='0.0 out of 5 stars')
    num_of_reviews = StringField('0')
    img_name = StringField(default='default.jpg')
