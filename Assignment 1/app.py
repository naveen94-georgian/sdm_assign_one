from flask import Flask, render_template
from pymongo import MongoClient
from PIL import Image
import tempfile, os, gridfs
from model.book import smd_amazon_col
from views import views
from shutil import copyfile

def init_flask_app():
    """
    Creating a folder in the tempdir to temporarily store the image data scraped from the amazon.ca website.
    """
    temp_path = 'static\\images\\amazon_scrapper'
    default_image = 'static\\images\\other\\default.jpg'
   
    if not os.path.exists(temp_path):
        os.makedirs(temp_path)
    
    """
    Deleting the images that are temporarily stored in the tempdir.
    """
    filelist = [ f for f in os.listdir(temp_path) if f.endswith(".jpg") ]
    for f in filelist:
        os.remove(os.path.join(temp_path, f))

    copyfile(default_image, temp_path+'\\default.jpg')
    print('temp_path: '+ temp_path)
    """
    Loading data during app startup 
    """
    img_db = mongo_client['smd_amazon_img_db']
    fs = gridfs.GridFS(img_db)
    img_lst = fs.list()
    for img_file in img_lst:
        data = fs.find({"filename": img_file}).next().read()
        with open(temp_path +'\\'+img_file,'wb') as op:
            op.write(data)


app = Flask(__name__)
CONN_STR = 'mongodb+srv://navdb:nav123@cluster0.dnpkj.mongodb.net/?retryWrites=true&w=majority'
mongo_client = MongoClient(CONN_STR)

app.register_blueprint(views)

init_flask_app()

app.debug = True
if __name__ == "__main__": 
        app.run()