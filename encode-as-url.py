import base64
import sys

with open("rjm.js" if len(sys.argv)<1 else sys.argv[1], "rb") as image_file:
    print("data:text/javascript;base64," + base64.b64encode(image_file.read()).decode())
