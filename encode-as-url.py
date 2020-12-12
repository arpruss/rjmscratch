import base64
import sys

with open(sys.argv[1], "rb") as image_file:
    print("data:text/javascript;base64," + base64.b64encode(image_file.read()).decode())
