from mongoengine import *
connect(
    host='mongodb+srv://navdb:nav123@cluster0.dnpkj.mongodb.net/smd_amazon_db'
)

class smd_amazon_col(Document):
    rank = IntField()
    title = StringField(max_length=300)
    author = StringField()
    format = StringField()
    price = StringField()
    rating= StringField()
    num_of_reviews = StringField()
    img_name = StringField()

    # @classmethod
    # def get_data(cls):
    #     return cls.objects()
