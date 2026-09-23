from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import urlopen


class KraftMartPreview(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split('?')[0] == '/api/products':
            with urlopen('https://kraftmart.shop/products.json?limit=250', timeout=30) as response:
                body = response.read()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'max-age=300')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def end_headers(self):
        if not self.path.split('?')[0].startswith('/api/'):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()


ThreadingHTTPServer(('127.0.0.1', 4173), KraftMartPreview).serve_forever()
