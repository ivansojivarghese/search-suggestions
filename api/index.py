
# get trending search keywords of the day

'''
from http.server import BaseHTTPRequestHandler, HTTPServer
from pytrends.request import TrendReq
import json

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Initialize pytrends object
        pytrends = TrendReq()
        pytrends.build_payload(kw_list=[], cat=0, timeframe='now 1-d', geo='US', gprop='youtube')

        # Fetch trending searches
        trending = pytrends.trending_searches(pn='united_states')

        # Prepare response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        # Send the data as JSON
        response = json.dumps({"trending": trending.tolist()})
        self.wfile.write(response.encode('utf-8'))

# Setting up and running the server locally
def run(server_class=HTTPServer, handler_class=SimpleHandler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting httpd server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
'''