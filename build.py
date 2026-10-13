#!/usr/bin/env python3
"""
Static build generator for KraftMart preview on Vercel and local static hosting.
Renders all Shopify Liquid templates and OS 2.0 JSON templates into static HTML.
"""

import os
import shutil
import server

OUTPUTS = [
    # (template_name, [destination_file_paths])
    ('index', ['index.html']),
    ('collection', [
        'collections/all/index.html',
        'collections/index.html',
        'products/index.html',
        'products.html'
    ]),
    ('product', [
        'product-detail.html',
        'products/jaipur-wedding-talwar/index.html',
        'products/royal-jodhpur-damascus/index.html',
        'products/dawami-ceremonial-sword/index.html'
    ]),
    ('page.about', [
        'pages/about/index.html',
        'pages/about-us/index.html',
        'about.html'
    ]),
    ('page.contact', [
        'pages/contact/index.html',
        'pages/contact-us/index.html',
        'contact.html'
    ]),
    ('page.wedding-swords', [
        'pages/wedding-swords/index.html',
        'wedding-swords.html'
    ]),
    ('blog', [
        'blogs/index.html',
        'blogs/news/index.html',
        'blog.html'
    ]),
    ('article', [
        'blogs/news/wedding-talwar-selection/index.html',
        'article.html'
    ]),
    ('cart', [
        'cart/index.html',
        'cart.html'
    ]),
    ('checkout', [
        'checkout/index.html',
        'checkout.html'
    ]),
    ('search', [
        'search/index.html',
        'search.html'
    ]),
    ('page.privacy-policy', [
        'pages/privacy-policy/index.html',
        'policies/privacy-policy/index.html',
        'privacy-policy.html'
    ]),
    ('page.return-policy', [
        'pages/return-policy/index.html',
        'policies/return-policy/index.html',
        'policies/refund-policy/index.html',
        'return-policy.html'
    ]),
    ('page.shipping-policy', [
        'pages/shipping-policy/index.html',
        'policies/shipping-policy/index.html',
        'shipping-policy.html'
    ]),
    ('page.processing-time', [
        'pages/processing-time/index.html',
        'policies/processing-time/index.html',
        'processing-time.html'
    ]),
    ('404', [
        '404.html'
    ])
]

def build():
    print("Generating static HTML files for Vercel deployment...")
    rendered_cache = {}

    for template, destinations in OUTPUTS:
        if template not in rendered_cache:
            try:
                rendered_cache[template] = server.render_page(template)
            except Exception as e:
                print(f"Error rendering {template}: {e}")
                continue

        content = rendered_cache[template]
        for dest in destinations:
            os.makedirs(os.path.dirname(dest) if os.path.dirname(dest) else '.', exist_ok=True)
            with open(dest, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Created {dest} ({len(content)} bytes)")

    print("\nStatic build completed successfully!")

if __name__ == '__main__':
    build()
