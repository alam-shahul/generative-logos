import base64

# https://stackoverflow.com/questions/5368669/convert-base64-to-image-in-python
def write_base64_as_png(png_b64text):
    png_recovered = base64.b64decode(png_b64text)
    with open("temp.png", "wb") as f:
        f.write(png_recovered)
