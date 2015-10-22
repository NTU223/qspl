#!/usr/bin/python

'''
See help:
    python qspl_downloader.py -h
    
For example:
    python qspl_downloader.py -f 2739 --show
    python qspl_downloader.py -f 2739 -s 1024x576 -o 2739.ts

'''

import requests
import re
import argparse

ORIGIN_HOST = 'http://dorcel-handsoff.com/'
HOST = 'http://cdn.odmanaged.com/'

class QSPL_downloader(object):
    '''
    Downloader for QSPL
    '''
    def __init__(self, film_id):
        self.film_id = film_id
        self.get_token()
        self.get_playlist()

    def get_token(self):
        magic_num = '11110016137201339006424_1445474559775'
        url = ORIGIN_HOST + ('/getToken.php?callback=jQuery%s&idFilm=%s' % (magic_num, self.film_id))
        res = requests.get(url)
        try:
            self.token = re.findall(r'\"(.+?)\"', res.content)[0]
        except:
            print 'No token found.'
            exit()

    def get_playlist(self):
        url = HOST + self.token + '/playlist.m3u8'
        res = requests.get(url)
        try:
            playlist = re.findall(r'(\/.+?\/playlist.m3u8)', res.content)
            sizelist = re.findall(r'RESOLUTION=(\d+x\d+)', res.content)
            self.playlist = [(playlist[i], sizelist[i]) for i in xrange(len(playlist))]
        except:
            print 'No playlist found.'
            exit()

    def show_size(self):
        for i in xrange(len(self.playlist)):
            print '%d: %s' % (i, self.playlist[i][1])

    def download_video(self, size, output_file):
        url = None
        for i in xrange(len(self.playlist)):
            if self.playlist[i][1] == size:
                url = HOST + self.playlist[i][0][1:]

        if not url:
            print 'Specified movie size not found.'
        else:
            res = requests.get(url)
            video_list = re.findall(r'(\/.+?\/media.ts)', res.content)
            f = open(output_file, 'wb')
            for i in xrange(len(video_list)):
                if i > 0:
                    print '\033[F\033[F'
                print 'Downloading... %d%% ( %d / %d )' % (int((i + 1.0) * 100 / len(video_list)), i + 1, len(video_list))
                f.write(requests.get(HOST + video_list[i][1:]).content)
            f.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('-f', help='Flim id from URL, e.g. -f 2739', type=int, required=True)    
    parser.add_argument('--show', help='Use this option will show all video size for specified movie.', action='store_true')
    parser.add_argument('-s', help='The size of movie you want to download, e.g. -s 1024x576')
    parser.add_argument('-o', help='The path of output file, e.g. -o movie')  
    args = parser.parse_args()

    qspl = QSPL_downloader(args.f)

    if args.show:
        qspl.show_size()

    else:
        if not args.s:
            print 'error: argument -s is required'
        elif not args.o:
            print 'error: argument -o is required'
        else:
            qspl.download_video(args.s, args.o)
