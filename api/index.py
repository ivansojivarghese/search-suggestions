
# get trending search keywords of the day

from flask import Flask, jsonify
from pytrends.request import TrendReq

app = Flask(__name__)

@app.route("/api", methods=["GET"])
def youtube_trending():
    pytrends = TrendReq()
    pytrends.build_payload(kw_list=[], cat=0, timeframe='now 1-d', geo='US', gprop='youtube')
    trending = pytrends.trending_searches(pn='united_states')
    return jsonify(trending.head(10).to_dict()[0])  # sends a JSON list of top 10 trends


'''
from pytrends.request import TrendReq

def handler(request):
    pytrends = TrendReq()
    pytrends.build_payload(kw_list=[], cat=0, timeframe='now 1-d', geo='US', gprop='youtube')
    trending = pytrends.trending_searches(pn='united_states')
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": trending.head(10).to_json()
    }
'''