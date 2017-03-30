from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import simplejson
import SocketServer
import boto3
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

#import s3 configuration credentials
execfile("./configuration.py")

#configure s3 boto3 connection
s3 = boto3.resource(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

#array to store urls
arr1 = []


#parse the video into frames then call save to aws on it
def parseVideo(videoFile):
    arr = []
    print "parseVideo", videoFile
    vidcap = cv2.VideoCapture(videoFile)
    print 'here'
    success,image = vidcap.read()
    seconds = 10
    counter = 1
    fps = int(round(vidcap.get(cv2.CAP_PROP_FPS))) # Gets the frames per second
    multiplier = fps * seconds
    while success:
        frameId = int(round(vidcap.get(1))) #current frame number, rounded b/c sometimes you get frame intervals which aren't integers...this adds a little imprecision but is likely good enough
        print frameId, multiplier
        success, image = vidcap.read()
        if frameId % multiplier == 0:
            filenameuploaded = 'pics'+str(counter)+'.jpg'
            cv2.imwrite(filenameuploaded, image)
            counter+=1
            print 'saving created image:', filenameuploaded
            arr.append(filenameuploaded)
    vidcap.release()
    print 'about to save the following pics:', arr
    awsSave(arr) #HERE WE SAVE TO AWS

#save to aws s3 and put urls into arr
def awsSave(arr):
    #maybe configure a bucket or folder for each user, right now all goes into one bucket
    # s3.create_bucket(Bucket=bucket, CreateBucketConfiguration={
    #     'LocationConstraint': 'us-west-1'})
    bucket = 'mybucket-bennettmertz'
    counter = 0
    for val in arr:
        print 'save attempt:', val
        counter += 1
        data = open(str(val), 'rb')
        s3.Bucket(bucket).put_object(
            Key='pics'+str(counter)+'.jpg',
            Body=data,
            ACL='public-read'
        )
        url = 'https://s3-us-west-1.amazonaws.com/'+str(bucket)+'/'+str(val)
        arr1.append(url)

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        print "in post method"
        cgitb.enable()
        content_len = int(self.headers.getheader('content-length', 0))
        post_body = self.rfile.read(content_len)

        videoFile = post_body[11:(len(post_body)-2)] #node passes python a string url (.mp4)
        videoFile = post_body #node passes python string like object containing the file
        print 'videoFile address', videoFile

        #PARSING OF VIDEO
        parseVideo(videoFile)
        print "Video Parsing Complete, sending data to node server"

        #POST BACK TO NODE SERVER THE LINKS FROM AWS
        payload = {
            'source': arr1
        }
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        res = requests.post('http://localhost:3000/predict', headers=headers, data=json.dumps(payload))
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
