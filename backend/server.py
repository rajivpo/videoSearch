from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import simplejson
import SocketServer
import requests
import cgi
import cgitb
import cv2
from StringIO import StringIO
import pycurl
import json
from io import BytesIO
import math
import numpy as np


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        print "in post method"
        cgitb.enable()

        content_len = int(self.headers.getheader('content-length', 0))
        post_body = self.rfile.read(content_len)
        # videoFile = post_body[11:(len(post_body)-2)] #node passes python string like object containing the file
        #jk i changed it so it only posts a string
        videoFile = post_body #node passes python string like object containing the file
        print 'videoFile address', videoFile
        # videoFile='https://media.w3.org/2010/05/sintel/trailer.mp4' #as long as link is mp4 it works
        vidcap = cv2.VideoCapture(videoFile)
        success,image = vidcap.read()
        seconds = 1
        fps = vidcap.get(cv2.CAP_PROP_FPS) # Gets the frames per second
        multiplier = fps * seconds
        while success:
            frameId = int(round(vidcap.get(1))) #current frame number, rounded b/c sometimes you get frame intervals which aren't integers...this adds a little imprecision but is likely good enough
            success, image = vidcap.read()
            if frameId % multiplier == 0:
                cv2.imwrite('pics.jpg', image)
            #--------------STEP 7---------------------
            #   SEND TO (maybe through node) AWS THE PICTURE FILE
            #--------------STEP 8 (new endpoint)------
        vidcap.release()
        print "Complete"
        #-------------------------------------
        #STEP 9 Can Post
        payload = {
            "source": videoFile
        }
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        res = requests.post('http://localhost:3000/python', headers=headers, data=json.dumps(payload))
        #-------------------------------------
        return

def run(server_class=HTTPServer, handler_class=Handler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'python server running'
    httpd.serve_forever()

def main():
    print "in main"
    run()


if __name__ == '__main__':
    # execute video parsing code
    main()
