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
import s3
import yaml

with open('s3.yaml', 'r') as fi:
    config = yaml.load(fi)
connection = s3.S3Connection(**config['s3'])
storage = s3.Storage(connection)

class Handler(BaseHTTPRequestHandler):
    def awsSave(filenameuploaded):
        # #here we upload file to default url
        # try:
        #     storage.write("pics.jpg", filenameuploaded)
        # except StorageError, e:
        #     print 'failed:', e
        print 'hi'
    def parseVideo(videoFile):
        #parse the video
        vidcap = cv2.VideoCapture(videoFile)
        success,image = vidcap.read()
        seconds = 10
        counter = 1
        fps = int(round(vidcap.get(cv2.CAP_PROP_FPS))) # Gets the frames per second
        multiplier = fps * seconds
        while success:
            frameId = int(round(vidcap.get(1))) #current frame number, rounded b/c sometimes you get frame intervals which aren't integers...this adds a little imprecision but is likely good enough
            print frameId, multiplier
            success, image = vidcap.read()
            print 'hey'
            if frameId % multiplier == 0:
                filenameuploaded = 'pics'+str(counter)+'.jpg'
                cv2.imwrite(filenameuploaded, image)
                counter+=1
                print 'saving created image'

                #AWS STUFF TO SPECIFY FOR UNIQUE USER
                #here we create a unique bucket for this upload
                # my_bucket_name = 'picturefile'+videoFile
                # storage.bucket_create(my_bucket_name)
                # assert storage.bucket_exists(my_bucket_name)

                #HERE WE SAVE TO AWS
                # awsSave(filenameuploaded)
                vidcap.release()
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

        #PARSING OF VIDEO
        parseVideo(videoFile)

        print "Video Parsing Complete"
        #-------------------------------------
        #POST BACK TO NODE SERVER THE LINKS FROM AWS
        payload = {
            'source': ['https://s3.amazonaws.com/leaguevideotest/pics1.jpg','https://s3.amazonaws.com/leaguevideotest/pics2.jpg','https://s3.amazonaws.com/leaguevideotest/pics3.jpg','https://s3.amazonaws.com/leaguevideotest/pics4.jpg','https://s3.amazonaws.com/leaguevideotest/pics5.jpg','https://s3.amazonaws.com/leaguevideotest/pics6.jpg']
        }
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        res = requests.post('http://localhost:3000/predict', headers=headers, data=json.dumps(payload))
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
