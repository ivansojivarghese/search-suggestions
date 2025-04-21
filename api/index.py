
# get trending search keywords of the day

from pytrends.request import TrendReq

def handler(request):
    pytrends = TrendReq()
    pytrends.build_payload(kw_list=[], cat=0, timeframe='now 1-d', geo='US', gprop='youtube')

    trending = pytrends.trending_searches(pn='united_states')

    return {
        "statusCode": 200,
        "body": {"trending": trending.tolist()},
        "headers": {"Content-Type": "application/json"}
    }
