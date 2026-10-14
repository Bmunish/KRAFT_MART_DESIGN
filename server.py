import os
import json
import re
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import urlopen


def clean_liquid(html):
    html = re.sub(r'{%\s*schema\s*%}.*?{%\s*endschema\s*%}', '', html, flags=re.DOTALL)
    html = re.sub(r"{{\s*'([^']+)'\s*\|\s*asset_url\s*}}", r'/assets/\1', html)
    html = re.sub(r'"{{\s*\'([^\']+)\'\s*\|\s*asset_url\s*}}"', r'"/assets/\1"', html)
    html = re.sub(r"{{\s*routes\.root_url[^}]*}}", '/', html)
    html = re.sub(r"{{\s*routes\.cart_url[^}]*}}", '/cart', html)
    html = re.sub(r"{{\s*routes\.cart_add_url[^}]*}}", '/cart/add', html)
    html = re.sub(r"{{\s*routes\.collections_url[^}]*}}", '/collections/all', html)
    html = re.sub(r"{{\s*routes\.all_products_collection_url[^}]*}}", '/collections/all', html)
    html = re.sub(r"{{\s*routes\.all_blogs_url[^}]*}}", '/blogs', html)
    html = re.sub(r"{{\s*routes\.search_url[^}]*}}", '/search', html)
    html = re.sub(r"{{\s*shop\.name\s*}}", 'KraftMart', html)
    html = re.sub(r"{{\s*shop\.url\s*}}", '', html)
    html = re.sub(r"{{\s*cart\.item_count\s*}}", '0', html)
    html = re.sub(r"{{\s*'now'\s*\|\s*date:[^}]*}}", '2026', html)
    html = re.sub(r"{{\s*section\.settings\.hero_title[^}]*}}", 'Royal Wedding Talwars, Handcrafted in Amritsar', html)
    html = re.sub(r"{{\s*section\.settings\.hero_subtext[^}]*}}", 'Authentic Rajput talwars &amp; ceremonial blades with complimentary custom laser engraving. Delivered with royal lineage to your doorstep.', html)
    html = re.sub(r"{{\s*content_for_header\s*}}", '', html)
    html = re.sub(r"{{\s*blog\.url[^}]*}}", '/blogs', html)
    html = re.sub(r"{{\s*blog\.title[^}]*}}", 'The Royal Archives &amp; Forge Blog', html)
    html = re.sub(r"{{\s*page\.title\s*}}", 'KraftMart', html)
    html = re.sub(r"{{\s*page\.content\s*}}", '', html)
    # Article tags
    html = re.sub(r"{{\s*article\.image\s*\|\s*img_url:[^}]*}}", '/assets/hero_talwar.png', html)
    html = re.sub(r"{{\s*article\.image[^}]*}}", '/assets/hero_talwar.png', html)
    html = re.sub(r"{{\s*article\.title\s*(?:\|[^\}]*)?}}", 'How to Choose the Perfect Wedding Talwar', html)
    html = re.sub(r"{{\s*article\.author\s*(?:\|[^\}]*)?}}", 'Amritsar Master Forge', html)
    html = re.sub(r"{{\s*article\.url\s*}}", '/blogs/news/wedding-talwar-selection', html)
    html = re.sub(r"{{\s*article\.published_at\s*\|\s*date:[^}]*}}", 'Aug 10, 2026', html)
    html = re.sub(r"{{\s*article\.tags\s*\|\s*join:[^}]*}}", 'Wedding Swords, Damascus, Lineage', html)
    html = re.sub(r"{{\s*article\.tags\.first\s*}}", 'Wedding Swords', html)
    html = re.sub(r"{{\s*article\.excerpt_or_content[^}]*}}", 'From blade curvature and hilt ergonomics to velvet scabbard colour-matching with your royal sherwani — our complete groom\'s guide to selecting an authentic heirloom sword.', html)
    # Product tags
    html = re.sub(r"{{\s*product\.title\s*(?:\|[^\}]*)?}}", 'Jaipur Wedding Talwar', html)
    html = re.sub(r"{{\s*product\.price\s*\|\s*money\s*}}", '₹2,599', html)
    html = re.sub(r"{{\s*product\.compare_at_price\s*\|\s*money\s*}}", '₹3,099', html)
    html = re.sub(r"{{\s*product\.vendor\s*}}", 'KraftMart Heritage', html)
    html = re.sub(r"{{\s*product\.description\s*}}", 'Red Velvet Scabbard · Kundan Brass Hilt · Free Laser Engraving · Ceremonial Grade Masterpiece crafted for traditional wedding ceremonies.', html)
    html = re.sub(r"{{\s*rel_product\.title\s*}}", 'Royal Damascus Talwar', html)
    html = re.sub(r"{{\s*rel_product\.url\s*}}", '/products/royal-jodhpur-damascus', html)
    html = re.sub(r"{{\s*rel_product\.price\s*\|\s*money\s*}}", '₹4,299', html)
    # Catch any remaining routes.* tag:
    html = re.sub(r"{{\s*routes\.[a-zA-Z0-9_]+\s*(?:\|[^\}]*)?}}", '/collections/all', html)

    # Handle for-else loops (for empty blogs/collections in preview, take the else branch)
    html = re.sub(r'{%\s*for\s+article\s+in\s+blogs\[.*?\]\.articles.*?%}.*?{%\s*else\s*%}(.*?){%\s*endfor\s*%}', r'\1', html, flags=re.DOTALL)
    html = re.sub(r'{%\s*for\s+article\s+in\s+blog\.articles.*?%}.*?{%\s*else\s*%}(.*?){%\s*endfor\s*%}', r'\1', html, flags=re.DOTALL)

    # Handle forms and paginates
    html = re.sub(r'{%\s*form\s+[^%]*%}', '<form method="post" action="/cart/add">', html)
    html = re.sub(r'{%\s*endform\s*%}', '</form>', html)
    html = re.sub(r'{%\s*if\s+paginate\.pages\s*>\s*1\s*%}.*?{%\s*endif\s*%}', '', html, flags=re.DOTALL)
    html = re.sub(r'{%\s*paginate\s+[^%]*%}', '', html)
    html = re.sub(r'{%\s*endpaginate\s*%}', '', html)

    # Clean any assign or capture tags
    html = re.sub(r'{%[-]?\s*assign\s+[^%]*[-]?%}', '', html)
    html = re.sub(r'{%[-]?\s*capture\s+[^%]*[-]?%}.*?{%[-]?\s*endcapture\s*[-]?%}', '', html, flags=re.DOTALL)

    # Resolve nested if/else/endif blocks safely from innermost to outermost
    if_pattern = r'{%[-]?\s*if\s+([^{%]*?)\s*[-]?%}((?:(?!{%[-]?\s*if).)*?){%[-]?\s*endif\s*[-]?%}'
    while True:
        m = re.search(if_pattern, html, flags=re.DOTALL)
        if not m:
            break
        body = m.group(2)
        if re.search(r'{%[-]?\s*else\s*[-]?%}', body):
            parts = re.split(r'{%[-]?\s*else\s*[-]?%}', body, maxsplit=1)
            replacement = parts[1]
        else:
            replacement = ''
        html = html[:m.start()] + replacement + html[m.end():]

    # FINAL PASS: Strip ANY remaining Liquid control tags {% ... %} and unrendered {{ ... }}
    # so NO Liquid syntax ever appears on screen!
    html = re.sub(r'{%[-]?\s*.*?[-]?%}', '', html, flags=re.DOTALL)
    html = re.sub(r'{{[-]?\s*.*?[-]?}}', '', html, flags=re.DOTALL)
    return html


def render_section(name, settings=None):
    path = f'sections/{name}.liquid'
    if not os.path.exists(path):
        return f'<!-- missing section {name} -->'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if settings:
        for k, v in settings.items():
            val_str = str(v).strip()
            if ('image' in k or val_str.endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg'))) and not val_str.startswith(('/', 'http')):
                val_str = f'/assets/{val_str}'
            pattern = r"{{\s*section\.settings\." + re.escape(k) + r"(?:\s*\|[^\}]*)?\s*}}"
            content = re.sub(pattern, val_str, content, flags=re.DOTALL)
    # Handle any asset_url default fallbacks:
    content = re.sub(r"{{\s*section\.settings\.[a-zA-Z0-9_]+\s*\|\s*default:\s*\('([^']+)'\s*\|\s*asset_url\)\s*}}", r'/assets/\1', content, flags=re.DOTALL)
    content = re.sub(r"{{\s*section\.settings\.[a-zA-Z0-9_]+\s*\|\s*default:\s*\"([^\"]*)\"\s*}}", r'\1', content, flags=re.DOTALL)
    content = re.sub(r"{{\s*section\.settings\.[a-zA-Z0-9_]+\s*\|\s*default:\s*'([^']*)'\s*}}", r'\1', content, flags=re.DOTALL)
    content = re.sub(r"{{\s*section\.settings\.[^}]*}}", '', content, flags=re.DOTALL)
    return clean_liquid(content)


def render_snippet(name):
    path = f'snippets/{name}.liquid'
    if not os.path.exists(path):
        return f'<!-- missing snippet {name} -->'
    with open(path, 'r', encoding='utf-8') as f:
        return clean_liquid(f.read())


def render_template(template_name):
    json_path = f'templates/{template_name}.json'
    liquid_path = f'templates/{template_name}.liquid'
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        out = []
        for s_key in data.get('order', []):
            s_info = data['sections'].get(s_key, {})
            s_type = s_info.get('type')
            if s_type:
                s_settings = s_info.get('settings', {})
                out.append(render_section(s_type, settings=s_settings))
        return '\n'.join(out)
    elif os.path.exists(liquid_path):
        with open(liquid_path, 'r', encoding='utf-8') as f:
            return clean_liquid(f.read())
    return render_section('main-404')


def render_page(template_name):
    with open('layout/theme.liquid', 'r', encoding='utf-8') as f:
        layout = f.read()

    layout = re.sub(r"{%\s*section\s*'([^']+)'\s*%}", lambda m: render_section(m.group(1)), layout)
    layout = re.sub(r"{%\s*render\s*'([^']+)'\s*%}", lambda m: render_snippet(m.group(1)), layout)
    layout = layout.replace('{{ content_for_layout }}', render_template(template_name))
    return clean_liquid(layout)


class KraftMartPreview(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        # 1. Decode path (handles %7B%7B, spaces, etc.)
        unquoted = urllib.parse.unquote(self.path)
        url_path = unquoted.split('?')[0].rstrip('/')
        if not url_path:
            url_path = '/'

        # 2. Redirect unrendered Liquid tag URLs (e.g. /{{ routes.collections_url }})
        if '{%' in url_path or '{{' in url_path or 'routes.' in url_path or '%7B' in self.path or '%7D' in self.path or 'article.image' in url_path:
            if 'blog' in url_path:
                target = '/blogs'
            elif 'collect' in url_path or 'product' in url_path:
                target = '/collections/all'
            elif 'about' in url_path:
                target = '/pages/about'
            elif 'contact' in url_path:
                target = '/pages/contact'
            elif 'wedding' in url_path:
                target = '/pages/wedding-swords'
            else:
                target = '/'
            self.send_response(302)
            self.send_header('Location', target)
            self.end_headers()
            return

        # Redirect legacy product-detail URLs to canonical /products/<handle>
        if 'product-detail' in url_path:
            parsed_query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            h = parsed_query.get('handle', ['jaipur-wedding-talwar'])[0]
            self.send_response(302)
            self.send_header('Location', f'/products/{urllib.parse.quote(h)}')
            self.end_headers()
            return

        # 3. API Proxy for live catalogue
        if url_path == '/api/products':
            try:
                with urlopen('https://kraftmart.shop/products.json?limit=250', timeout=10) as response:
                    body = response.read()
            except Exception:
                body = b'{"products":[]}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'max-age=300')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        # 4. Check for direct static files on disk
        clean_file_path = url_path.lstrip('/')
        if clean_file_path:
            if os.path.isfile(clean_file_path):
                return super().do_GET()
            asset_candidate = os.path.join('assets', clean_file_path)
            if os.path.isfile(asset_candidate):
                self.path = f'/assets/{clean_file_path}'
                return super().do_GET()

        # 5. Route to template mapping
        route_map = {
            '/': 'index',
            '/index': 'index',
            '/index.html': 'index',
            '/collections': 'collection',
            '/collections/all': 'collection',
            '/products': 'collection',
            '/products.html': 'collection',
            '/product-detail.html': 'product',
            '/product-detail': 'product',
            '/pages/about': 'page.about',
            '/pages/about-us': 'page.about-us',
            '/about': 'page.about',
            '/about.html': 'page.about',
            '/pages/contact': 'page.contact',
            '/pages/contact-us': 'page.contact-us',
            '/contact': 'page.contact',
            '/contact.html': 'page.contact',
            '/pages/wedding-swords': 'page.wedding-swords',
            '/wedding-swords': 'page.wedding-swords',
            '/wedding-swords.html': 'page.wedding-swords',
            '/pages/faq': 'page.faq',
            '/faq': 'page.faq',
            '/blogs': 'blog',
            '/blog': 'blog',
            '/blog.html': 'blog',
            '/cart': 'cart',
            '/search': 'search',
            '/pages/privacy-policy': 'page.privacy-policy',
            '/policies/privacy-policy': 'page.privacy-policy',
            '/privacy-policy': 'page.privacy-policy',
            '/privacy-policy.html': 'page.privacy-policy',
            '/pages/refund-policy': 'page.refund-policy',
            '/policies/refund-policy': 'page.return-policy',
            '/refund-policy': 'page.return-policy',
            '/pages/return-policy': 'page.return-policy',
            '/policies/return-policy': 'page.return-policy',
            '/return-policy': 'page.return-policy',
            '/return-policy.html': 'page.return-policy',
            '/pages/shipping-policy': 'page.shipping-policy',
            '/policies/shipping-policy': 'page.shipping-policy',
            '/shipping-policy': 'page.shipping-policy',
            '/shipping-policy.html': 'page.shipping-policy',
            '/pages/processing-time': 'page.processing-time',
            '/policies/processing-time': 'page.processing-time',
            '/processing-time': 'page.processing-time',
            '/processing-time.html': 'page.processing-time',
            '/pages/terms-of-service': 'page.terms-of-service',
            '/policies/terms-of-service': 'page.terms-of-service',
            '/terms-of-service': 'page.terms-of-service',
        }

        template = route_map.get(url_path)
        if not template:
            if url_path.startswith('/collections'):
                template = 'collection'
            elif url_path.startswith('/products/'):
                template = 'product'
            elif url_path.startswith('/blogs/') or url_path.startswith('/blog/'):
                parts = [p for p in url_path.split('/') if p]
                if len(parts) >= 2 and parts[-1] not in ('all', 'news', 'blog'):
                    template = 'article'
                else:
                    template = 'blog'
            elif url_path.startswith('/pages/'):
                page_slug = url_path.replace('/pages/', '').split('/')[0].replace('.html', '')
                if os.path.exists(f'templates/page.{page_slug}.json'):
                    template = f'page.{page_slug}'
                else:
                    template = 'page'
            elif url_path.startswith('/policies/'):
                policy_slug = url_path.replace('/policies/', '').split('/')[0].replace('.html', '')
                if 'ship' in policy_slug:
                    template = 'page.shipping-policy'
                elif 'process' in policy_slug:
                    template = 'page.processing-time'
                elif 'return' in policy_slug or 'refund' in policy_slug:
                    template = 'page.return-policy'
                elif 'privac' in policy_slug:
                    template = 'page.privacy-policy'
                else:
                    template = 'page'

        if template:
            try:
                html = render_page(template)
                body = html.encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                self.wfile.write(body)
                return
            except Exception as e:
                err = f'Error rendering template {template}: {e}'.encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'text/plain')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
                return

        # 6. Fallback: Render branded 404 template inside theme layout
        try:
            html = render_page('404')
            body = html.encode('utf-8')
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(body)
            return
        except Exception:
            super().do_GET()


if __name__ == '__main__':
    print('Starting KraftMart local Shopify Theme preview server at http://127.0.0.1:4173 ...')
    ThreadingHTTPServer(('127.0.0.1', 4173), KraftMartPreview).serve_forever()
