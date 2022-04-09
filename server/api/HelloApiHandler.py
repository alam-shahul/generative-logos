from flask import request
from flask_restful import Api, Resource, reqparse
from api.process_image import write_base64_as_png, crop, reimagine
from pathlib import Path

class HelloApiHandler(Resource):
  def get(self):
    return {
      'resultStatus': 'SUCCESS',
      'message': "Hello Api Handler"
      }

  def post(self):
    print(dir(self))
    json_data = request.get_json(force=True)
    
    text_prompt = 'the letters C, P, C and B with DNA wrapped around them'
    text_prompt = json_data["prompt"]
    image_data = json_data["image"]
    image_format, base64_image = image_data.split(",")
    filepath = Path("temp.png")
    cropped_filepath = Path("cropped_temp.png")
    write_base64_as_png(base64_image, filepath)
    crop(filepath, cropped_filepath)
    reimagine(text_prompt, cropped_filepath, mode="steer")

    ret_msg = json_data

    if ret_msg:
      message = "Your Message Requested: {}".format(ret_msg)
    else:
      message = "No Msg"
    
    final_ret = {"status": "Success", "message": "nice"}
    return final_ret
