from flask import Flask, send_from_directory
from flask_restful import Api, Resource
from api.HelloApiHandler import HelloApiHandler
import logging
logging.getLogger('flask_cors').level = logging.DEBUG

app = Flask(__name__, static_url_path='', static_folder='../client/build')
# # CORS(app) #comment this on deployment
# CORS(app, resources={r'/*' : {'origins': ['http://localhost:3000']}})
# CORS(app, support_credentials=True)

app.config['CORS_HEADERS'] = 'Content-Type'

api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

api.add_resource(HelloApiHandler, '/flask/hello')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True, threaded=True)
