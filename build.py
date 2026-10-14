#!/usr/bin/env python3
"""Render the Shopify theme into static files for Vercel preview hosting."""

import hashlib
import json
import shutil
from pathlib import Path

import server


OUTPUTS = {
    "index": ["index.html"],
    "collection": ["collections/all/index.html"],
    "product": [
        "product-detail.html",
        "products/jaipur-wedding-talwar/index.html",
        "products/royal-jodhpur-damascus/index.html",
        "products/dawami-ceremonial-sword/index.html",
    ],
    "page.about": ["pages/about/index.html"],
    "page.contact": ["pages/contact/index.html"],
    "page.wedding-swords": ["pages/wedding-swords/index.html"],
    "blog": ["blogs/index.html", "blogs/news/index.html"],
    "article": ["blogs/news/wedding-talwar-selection/index.html"],
    "cart": ["cart/index.html"],
    "search": ["search/index.html"],
    "page.privacy-policy": ["pages/privacy-policy/index.html"],
    "page.return-policy": ["pages/return-policy/index.html"],
    "page.shipping-policy": ["pages/shipping-policy/index.html"],
    "page.processing-time": ["pages/processing-time/index.html"],
    "404": ["404.html"],
}


def build():
    versioned_assets = {
        name: hashlib.sha256((Path("assets") / name).read_bytes()).hexdigest()[:12]
        for name in ("kraftmart-heritage.css", "kraftmart-heritage.js", "km-cart.js")
    }
    output = Path("public")
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()

    for template, destinations in OUTPUTS.items():
        page = "\n".join(line.rstrip() for line in server.render_page(template).splitlines()) + "\n"
        for name, version in versioned_assets.items():
            page = page.replace(f"/assets/{name}", f"/assets/{name}?v={version}")
        for destination in destinations:
            path = output / destination
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(page, encoding="utf-8")

    shutil.copytree("assets", output / "assets")
    (output / "api").mkdir()
    shutil.copyfile("api/products.json", output / "api/products.json")

    deployment = Path("vercel")
    if deployment.exists():
        shutil.rmtree(deployment)
    shutil.copytree(output, deployment)
    config = json.loads(Path("vercel.json").read_text(encoding="utf-8"))
    config.pop("buildCommand", None)
    config.pop("outputDirectory", None)
    (deployment / "vercel.json").write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    build()
