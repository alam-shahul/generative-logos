import base64
from deep_daze import Imagine
from PIL import Image

# https://stackoverflow.com/questions/5368669/convert-base64-to-image-in-python
def write_base64_as_png(png_b64text, filepath):
    png_recovered = base64.b64decode(png_b64text)
    with open(filepath, "wb") as f:
        f.write(png_recovered)

def crop(filepath, new_filepath):                                                                                                                                                                                                                             
    im = Image.open(filepath)
    width, height = im.size   # Get dimensions
        
    new_width = 256 
    new_height = 256 
        
    left = (width - new_width)/2
    top = (height - new_height)/2
    right = (width + new_width)/2
    bottom = (height + new_height)/2
        
    # Crop the center of the image
    im = im.crop((left, top, right, bottom))
        
    im.save(new_filepath)

def reimagine(text, filepath, mode="refine"):
	"""Use deep-daze to reimagine a logo

	"""
	if mode == "refine":
		im = Image.open(filepath)
		imagine = Imagine(
		    # text = text,
		        num_layers = 24,
		        image_width = 256,
		        epochs = 8,
				img = im,
		        # start_image_path = filepath,
				# start_image_train_iters=10,
				save_progress=True,
				save_gif=True,
				iterations=200,
		)
	
	elif mode == "steer":
		imagine = Imagine(
		    	text = text,
		        num_layers = 48,
		        image_width = 256,
		        epochs = 10,
				batch_size=64,
                gradient_accumulate_every=1,
		        start_image_path = filepath,
				start_image_train_iters=20,
				save_progress=True,
				save_gif=True,
				iterations=500,
		)


	imagine()
