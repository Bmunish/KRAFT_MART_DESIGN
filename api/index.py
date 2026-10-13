import os
import json
from http.server import BaseHTTPRequestHandler
from urllib.request import Request, urlopen

class handler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        # Allow CORS
        origin = self.headers.get('Origin', '*')
        
        try:
            req = Request(
                'https://kraftmart.shop/products.json?limit=250',
                headers={'User-Agent': 'Mozilla/5.0 (KraftMart Vercel Proxy)'}
            )
            with urlopen(req, timeout=8) as response:
                body = response.read()
        except Exception:
            # Fallback to local cached JSON if external request fails or times out
            cache_path = os.path.join(os.path.dirname(__file__), 'products.json')
            if os.path.isfile(cache_path):
                with open(cache_path, 'rb') as f:
                    body = f.read()
            else:
                body = b'{"products":[]}'

        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', origin)
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
