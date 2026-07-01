import time
import requests

def test():
    for _ in range(60):
        try:
            r = requests.get("http://localhost:8000/health")
            if r.status_code == 200:
                print("Health check passed!")
                break
            elif r.status_code == 503:
                print("Server up but model loading...")
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(2)
    else:
        print("Server did not start or model did not load in time.")
        return

    print("Testing /stats...")
    r = requests.get("http://localhost:8000/stats")
    print("/stats response:", r.json())
    
    print("Testing /history...")
    r = requests.get("http://localhost:8000/history")
    print("/history response:", r.json())

    print("Testing /analyze...")
    try:
        r = requests.post("http://localhost:8000/analyze", json={"text": "This is a test. Another sentence."})
        print("/analyze response status:", r.status_code)
        resp = r.json()
        print("/analyze prediction:", resp.get('prediction'))
        print("/analyze keys:", list(resp.keys()))
        if 'sentence_analysis' in resp:
            print("Sentence analysis:", resp['sentence_analysis'])
    except Exception as e:
        print("Analyze failed! ERROR:", e)

test()
