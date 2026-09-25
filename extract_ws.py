import re
import os

def extract_main_content(filepath):
    if not os.path.exists(filepath): return ''
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    match = re.search(r'</header>(.*?)<footer', html, flags=re.DOTALL)
    if not match: return ''
    content = match.group(1).strip()
    
    # fix assets
    content = re.sub(r'src="assets/([^"]+)"', r'src="{{ \'\1\' | asset_url }}"', content)
    content = re.sub(r'href="assets/([^"]+)"', r'href="{{ \'\1\' | asset_url }}"', content)
    content = re.sub(r'url\([\'"]?assets/([^"\')]+)[\'"]?\)', r"url('{{ '\1' | asset_url }}')", content)
    content = re.sub(r"{{ '([^']+)\?v=[^']+' \| asset_url }}", r"{{ '\1' | asset_url }}", content)
    
    # fix internal links
    content = content.replace('href="index.html"', 'href="/"')
    content = content.replace('href="products.html"', 'href="/collections/all"')
    content = content.replace('href="products.html?category=wedding"', 'href="/collections/wedding-swords"')
    content = content.replace('href="wedding-swords.html"', 'href="/pages/wedding-swords"')
    content = content.replace('href="about.html"', 'href="/pages/about"')
    content = content.replace('href="contact.html"', 'href="/pages/contact"')
    content = re.sub(r'href="product-detail\.html\?handle=([^"]+)"', r'href="/products/\1"', content)
    return content

ws_content = extract_main_content('wedding-swords.html')
if ws_content:
    with open('shopify_theme/templates/page.wedding-swords.liquid', 'w', encoding='utf-8') as f:
        f.write(ws_content)
    print("Extracted wedding swords.")
