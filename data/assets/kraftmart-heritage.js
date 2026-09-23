/**
 * KRAFTMART — LUXURY INDIAN HERITAGE THEME INTERACTIVE SCRIPT
 * Handles Sticky Header, Accordion FAQ, Quick View Drawer, AJAX Cart Sync & Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initFaqAccordions();
  initCartDrawer();
  initQuickViewModal();
  initVideoAutoplay();
  initMarqueePause();
  initNoiseBackground();
  initSegmentedTabs();
  init3DTiltParallax();
  init3DCinematicCarousel();
  initCategoryDragCarousel();
  initTestimonialFadeSlider();
  initScrollReveal();
  initSearchOverlayModal();
  initRealCatalogue();
  initHeroSlider();
  initBubbleSensitivity();
  initProductBubbleClicks();
  initLiveEngravingSimulator();
  hydrateProductDetail();
});


/* Public Shopify data is the single catalogue source for the static preview.
   Shopify's theme itself continues to use Liquid product objects. */
const KM_PRODUCTS_ENDPOINT = '/api/products';
let kmProductsPromise;

function getLiveProducts() {
  if (!kmProductsPromise) {
    kmProductsPromise = fetch(KM_PRODUCTS_ENDPOINT)
      .then(response => response.ok ? response.json() : Promise.reject(response.status))
      .then(data => data.products.filter(product => product.handle !== 'partial-payment'));
  }
  return kmProductsPromise;
}

function kmEscape(value = '') {
  const node = document.createElement('span');
  node.textContent = value;
  return node.innerHTML;
}

function kmEscapeAttr(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function kmDecodeHtml(value = '') {
  const node = document.createElement('textarea');
  node.innerHTML = value;
  return node.value;
}

function kmPlainTextFromHtml(value = '') {
  let decoded = String(value || '');
  for (let i = 0; i < 3; i += 1) {
    const next = kmDecodeHtml(decoded);
    if (next === decoded) break;
    decoded = next;
  }
  const node = document.createElement('div');
  node.innerHTML = decoded.replace(/<!--[\s\S]*?-->/g, ' ');
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function kmBuildQuickViewDetails(descRaw = '', specsRaw = '') {
  const plainDescription = kmPlainTextFromHtml(descRaw);
  const cleanedDescription = plainDescription
    .replace(/^about the sword\s*/i, '')
    .replace(/^kraftmart product description\s*/i, '')
    .replace(/paste into:\s*shopify admin[^.]*\.?/i, '')
    .replace(/description box\s*→\s*show html\s*\(\s*<\s*>\s*icon\s*\)/i, '')
    .replace(/={3,}/g, ' ')
    .trim();
  const description = cleanedDescription.split(/specifications?/i)[0].trim() || cleanedDescription;
  const specs = [];
  const seen = new Set();

  function addSpec(key, value) {
    const cleanKey = (key || '').replace(/\s+/g, ' ').trim();
    const cleanValue = (value || '').replace(/\s+/g, ' ').trim();
    if (!cleanKey || !cleanValue) return;
    const signature = `${cleanKey.toLowerCase()}::${cleanValue.toLowerCase()}`;
    if (seen.has(signature)) return;
    seen.add(signature);
    specs.push({ key: cleanKey, value: cleanValue });
  }

  // Prefer explicit metadata when provided by static cards.
  specsRaw.split('|').forEach(pair => {
    const splitIndex = pair.indexOf(':');
    if (splitIndex === -1) return;
    addSpec(pair.slice(0, splitIndex), pair.slice(splitIndex + 1));
  });

  // Backfill specs from rich description text like "Blade length - 39 inches".
  const specBlock = plainDescription.match(/specifications?\s*[:\-]?\s*(.+)$/i);
  const specText = specBlock ? specBlock[1] : '';
  const specRegex = /([A-Za-z][A-Za-z\s]{2,40})\s*[-:]\s*([^.;|]{2,90})/g;
  let match;
  while ((match = specRegex.exec(specText)) !== null) {
    addSpec(match[1], match[2]);
  }

  return {
    description,
    specs
  };
}

function kmMoney(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
}

function kmCategory(product) {
  const content = `${product.title} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (content.includes('damascus')) return 'damascus';
  if (content.includes('kada') || content.includes('miniature') || content.includes('dagger')) return 'miniature';
  return 'wedding';
}

function kmProductCard(product, showSwatches) {
  const variant = product.variants[0] || {};
  const image = product.images[0] && product.images[0].src;
  const compare = Number(variant.compare_at_price);
  const price = Number(variant.price);
  const saving = compare > price ? `Save ${kmMoney(compare - price)}` : '';
  const detailUrl = `product-detail.html?handle=${encodeURIComponent(product.handle)}`;
  const details = kmBuildQuickViewDetails(product.body_html || '', '');
  const specsAttr = details.specs.slice(0, 6).map(spec => `${spec.key}: ${spec.value}`).join('|');

  // Display ABCD & color options ONLY on the products catalog page
  const isCatalogPage = showSwatches !== undefined ? Boolean(showSwatches) : (
    typeof document !== 'undefined' && (
      (!!document.querySelector('[data-live-mode="catalog"]') || !!document.getElementById('kmProductGrid') || window.location.pathname.includes('products')) &&
      !document.querySelector('[data-live-mode="home"]') &&
      !window.location.pathname.endsWith('index.html')
    )
  );

  const swatchesHtml = isCatalogPage ? `
    <div class="km-swatch-container">
      <div class="km-variant-swatches">
        <span class="km-swatch-btn">A</span>
        <span class="km-swatch-btn">B</span>
        <span class="km-swatch-btn">C</span>
        <span class="km-swatch-btn km-swatch-btn-active">D</span>
      </div>
      <div class="km-color-swatches">
        <span class="km-color-swatch" style="background-color: red; color: red;"></span>
        <span class="km-color-swatch" style="background-color: blue; color: blue;"></span>
        <span class="km-color-swatch" style="background-color: green; color: green;"></span>
        <span class="km-color-swatch km-color-active" style="background-color: #FFA500; color: #FFA500;"></span>
      </div>
    </div>` : '';

  return `<article class="km-product-card km-noise-card" data-handle="${kmEscapeAttr(product.handle || '')}" data-category="${kmCategory(product)}" data-qv-img="${kmEscapeAttr(image || '')}" data-qv-title="${kmEscapeAttr(product.title)}" data-qv-desc="${kmEscapeAttr(details.description || '')}" data-qv-specs="${kmEscapeAttr(specsAttr)}" data-qv-price="${kmEscapeAttr(kmMoney(price))}" data-qv-compare="${compare > price ? kmEscapeAttr(kmMoney(compare)) : ''}" data-inr-price="${price}" data-price="${price}">
    <div class="km-product-media">${saving ? `<span class="km-sale-badge">${saving}</span>` : ''}<a href="${detailUrl}">${image ? `<img src="${kmEscape(image)}" alt="${kmEscape(product.title)}" class="km-product-img" loading="lazy">` : ''}</a><a class="km-quick-view-btn" href="${detailUrl}">View product</a></div>
    <div class="km-product-info"><span class="km-product-vendor">${kmEscape(product.vendor || 'KraftMart')}</span><h3 class="km-product-title"><a href="${detailUrl}">${kmEscape(product.title)}</a></h3><div class="km-price-wrapper"><span class="km-price-current">${kmMoney(price)}</span>${compare > price ? `<span class="km-price-compare">${kmMoney(compare)}</span>` : ''}</div>${swatchesHtml}<a class="km-add-cart-btn" href="${detailUrl}">View product</a></div>
  </article>`;
}

function kmCleanCardTitle(title) {
  if (!title) return 'Ceremonial Masterpiece';
  let clean = title.split(/[|–—]/)[0].trim();
  if (clean.length > 34) clean = clean.substring(0, 34) + '...';
  return clean;
}

function hydrateHeroCards(products) {
  document.querySelectorAll('.km-3d-card').forEach((card, index) => {
    const product = products[index];
    if (!product) return;
    const variant = product.variants[0] || {};
    const image = product.images[0] && product.images[0].src;
    const compare = Number(variant.compare_at_price);
    const price = Number(variant.price);
    const shortTitle = kmCleanCardTitle(product.title);
    card.innerHTML = `<a href="product-detail.html?handle=${encodeURIComponent(product.handle)}" class="km-3d-card-img-wrap" aria-label="${kmEscape(product.title)}">${image ? `<img src="${kmEscape(image)}" alt="${kmEscape(product.title)}">` : ''}</a><div class="km-3d-card-label"><span class="km-3d-card-tag">✦ KraftMart Heritage</span><h3 class="km-3d-card-title" title="${kmEscape(product.title)}">${kmEscape(shortTitle)}</h3><div class="km-3d-card-price">${kmMoney(price)}${compare > price ? `<span>${kmMoney(compare)}</span>` : ''}</div></div>`;
  });
}

const KM_STATIC_PRODUCTS = {
  'jaipur-wedding-talwar': {
    handle: 'jaipur-wedding-talwar',
    title: 'Jaipur Wedding Talwar',
    product_type: 'Wedding Swords',
    vendor: 'KraftMart Heritage',
    body_html: 'Crafted specifically for royal wedding ceremonies. Features a solid brass Kundan engraved hilt, deep red zari velvet-sheathed scabbard, and a hand-polished high carbon steel blade. Includes complimentary custom laser engraving of groom and bride names.',
    variants: [{ price: 2599, compare_at_price: 3099, available: true }],
    images: [{ src: 'assets/hero_talwar.png', alt: 'Jaipur Wedding Talwar' }, { src: 'assets/sword.png', alt: 'Scabbard View' }, { src: 'assets/sword2.png', alt: 'Blade Inscription' }]
  },
  'royal-jodhpur-damascus': {
    handle: 'royal-jodhpur-damascus',
    title: 'Royal Jodhpur Damascus Talwar',
    product_type: 'Damascus Steel Swords',
    vendor: 'KraftMart Heritage',
    body_html: 'Handforged 1095 & 15N20 layered pattern welded Damascus steel blade with solid brass hilt and midnight velvet scabbard. Tested to 56–58 HRC hardness. Complimentary custom laser engraving included.',
    variants: [{ price: 4299, compare_at_price: 4999, available: true }],
    images: [{ src: 'assets/sword2.png', alt: 'Royal Jodhpur Damascus' }, { src: 'assets/hero_talwar.png', alt: 'Damascus Pattern' }, { src: 'assets/sword.png', alt: 'Hilt Detail' }]
  },
  'dawami-ceremonial-sword': {
    handle: 'dawami-ceremonial-sword',
    title: 'Dawami Ceremonial Sword',
    product_type: 'Ceremonial Swords',
    vendor: 'KraftMart Heritage',
    body_html: 'Traditional Sikh & Rajput marriage sword with mirror-polish carbon steel blade and gold zari velvet scabbard. Handcrafted in Amritsar, Punjab with free custom blade inscription.',
    variants: [{ price: 1999, compare_at_price: 2499, available: true }],
    images: [{ src: 'assets/sword.png', alt: 'Dawami Ceremonial Sword' }, { src: 'assets/hero_talwar.png', alt: 'Gold Zari Sheath' }, { src: 'assets/sword2.png', alt: 'Grip Close-up' }]
  }
};

function hydrateProductDetail(products = []) {
  const detail = document.querySelector('[data-live-product-detail]');
  if (!detail) return;
  const handle = new URLSearchParams(window.location.search).get('handle') || 'jaipur-wedding-talwar';
  let product = Array.isArray(products) ? products.find(item => item.handle === handle) : null;
  if (!product && KM_STATIC_PRODUCTS[handle]) {
    product = KM_STATIC_PRODUCTS[handle];
  }
  if (!product) {
    product = (Array.isArray(products) && products[0]) || KM_STATIC_PRODUCTS['jaipur-wedding-talwar'];
  }
  if (!product) return;
  const variant = product.variants[0] || {};
  const price = Number(variant.price);
  const compare = Number(variant.compare_at_price);
  const images = product.images || [];
  const image = images[0] && images[0].src;
  document.title = `${product.title} | KraftMart`;
  const crumb = document.querySelector('[data-product-breadcrumb]');
  if (crumb) crumb.textContent = product.title;
  const titleEl = detail.querySelector('[data-product-title]');
  if (titleEl) titleEl.textContent = product.title;
  const typeEl = detail.querySelector('[data-product-type]');
  if (typeEl) typeEl.textContent = product.product_type || product.vendor || 'KraftMart';
  const description = detail.querySelector('[data-product-description]');
  if (description) description.textContent = (product.body_html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const priceRow = detail.querySelector('[data-product-price]');
  if (priceRow) priceRow.innerHTML = `<span style="font-family:var(--km-font-heading);font-size:2.2rem;font-weight:700;color:var(--km-crimson-primary);">${kmMoney(price)}</span>${compare > price ? `<span style="font-size:1.1rem;color:var(--km-text-secondary);text-decoration:line-through;">${kmMoney(compare)}</span><span class="km-sale-badge" style="position:static;">${Math.round((compare - price) / compare * 100)}% OFF</span>` : ''}`;
  const add = detail.querySelector('[data-product-add]');
  if (add) add.textContent = variant.available !== false ? `ADD TO CART — ${kmMoney(price)}` : 'SOLD OUT';
  const main = document.getElementById('kmPdpMainImage');
  if (main && image) { main.src = image; main.alt = product.title; }
  const thumbs = document.querySelector('.km-pdp-thumbs');
  if (thumbs && images.length) {
    thumbs.innerHTML = images.slice(0, 5).map((item, index) => `<button class="km-pdp-thumb${index === 0 ? ' is-active' : ''}" type="button" aria-label="View image ${index + 1}"><img src="${kmEscape(item.src)}" alt="${kmEscape(item.alt || product.title)}"></button>`).join('');
    thumbs.querySelectorAll('.km-pdp-thumb').forEach(button => button.addEventListener('click', () => {
      const selected = button.querySelector('img');
      if (main && selected) { main.src = selected.src; main.alt = selected.alt; }
      thumbs.querySelectorAll('.km-pdp-thumb').forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
    }));
  }
}

async function initRealCatalogue() {
  try {
    const products = await getLiveProducts();
    hydrateHeroCards(products);

    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const priceParam = urlParams.get('price');

    let displayProducts = products;
    if (categoryParam) {
      if (categoryParam === 'wedding') {
        displayProducts = products.filter(p => kmCategory(p) === 'wedding');
      } else if (categoryParam === 'damascus') {
        displayProducts = products.filter(p => kmCategory(p) === 'damascus');
      } else if (categoryParam === 'miniature') {
        displayProducts = products.filter(p => kmCategory(p) === 'miniature');
      } else if (categoryParam === 'wall-hangings') {
        displayProducts = products.filter(p => (p.title + ' ' + (p.tags || []).join(' ')).toLowerCase().includes('wall') || kmCategory(p) === 'wedding');
      }
    } else if (priceParam === 'under2000') {
      displayProducts = products.filter(p => Number(p.variants[0]?.price) <= 2000);
    }

    document.querySelectorAll('[data-live-products]').forEach(grid => {
      const isCatalog = grid.dataset.liveMode === 'catalog' || grid.id === 'kmProductGrid';
      const sourceList = isCatalog ? displayProducts : products;
      const limit = grid.dataset.liveProducts === 'all' ? sourceList.length : Number(grid.dataset.liveProducts);
      grid.innerHTML = sourceList.slice(0, limit).map(p => kmProductCard(p, isCatalog)).join('');
    });

    const count = document.getElementById('kmCatalogCount');
    if (count) count.textContent = `${displayProducts.length} KraftMart products`;

    const sort = document.getElementById('kmCatalogSort');
    sort?.addEventListener('change', () => {
      const grid = document.querySelector('[data-live-mode="catalog"]') || document.getElementById('kmProductGrid');
      const sorted = [...displayProducts].sort((a, b) => {
        const aPrice = Number(a.variants[0]?.price), bPrice = Number(b.variants[0]?.price);
        return sort.selectedIndex === 1 ? aPrice - bPrice : sort.selectedIndex === 2 ? bPrice - aPrice : 0;
      });
      if (grid) grid.innerHTML = sorted.map(p => kmProductCard(p, true)).join('');
    });
    hydrateProductDetail(products);
    initProductBubbleClicks(products);
  } catch (error) {
    console.warn('KraftMart catalogue could not be loaded.', error);
  }
}

/**
 * Floating Sword Hero Showcase
 * — Hydrates sword images/links from live product data (or uses static fallback)
 * — Adds cursor-based parallax (mouse) on desktop; CSS-only on mobile
 */
function initFloatingSwords() {
  const stage = document.getElementById('kmFloatStage');
  if (!stage) return;

  const swords = Array.from(stage.querySelectorAll('.km-float-sword'));
  if (!swords.length) return;

  // Parallax depth values from data-depth attribute
  const depths = swords.map(s => parseFloat(s.dataset.depth) || 1);

  // Cursor parallax — desktop only (skip on touch devices)
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  // Extra per-sword transform offsets from parallax (set inline, added to CSS animation)
  const parallaxOffsets = swords.map(() => ({ x: 0, y: 0 }));

  function applyParallax() {
    // Lerp for smooth catch-up
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    swords.forEach((sword, i) => {
      const px = currentX * depths[i] * 14;  // max ~14px * depth
      const py = currentY * depths[i] * 8;
      parallaxOffsets[i].x = px;
      parallaxOffsets[i].y = py;
      // CSS animation is on the element itself; we shift via a wrapper-level transform.
      // Since we can't stack transforms cleanly without a wrapper, we use a CSS var approach.
      sword.style.setProperty('--px', `${px.toFixed(1)}px`);
      sword.style.setProperty('--py', `${py.toFixed(1)}px`);
    });
    rafId = requestAnimationFrame(applyParallax);
  }

  stage.addEventListener('mousemove', (e) => {
    if (isTouchDevice()) return;
    const rect = stage.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1 to 1
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!rafId) applyParallax();
  });

  stage.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  // Hydrate with live product data (up to 3 featured products)
  getLiveProducts().then(products => {
    const featured = products.slice(0, 3);
    swords.forEach((sword, i) => {
      const product = featured[i];
      if (!product) return;
      const variant = product.variants[0] || {};
      const price = Number(variant.price);
      const compare = Number(variant.compare_at_price);
      const image = product.images[0]?.src;
      const detailUrl = `product-detail.html?handle=${encodeURIComponent(product.handle)}`;

      // Update href
      sword.href = detailUrl;
      sword.setAttribute('aria-label', `View ${product.title}`);

      // Update image
      const img = sword.querySelector('.km-float-img');
      if (img && image) {
        img.src = image;
        img.alt = product.title;
      }

      // Update label
      const name = sword.querySelector('.km-float-label-name');
      const priceEl = sword.querySelector('.km-float-label-price');
      if (name) name.textContent = product.title;
      if (priceEl) priceEl.textContent = kmMoney(price);
    });
  }).catch(() => {
    // Static fallback already in HTML — just ensure links go to products page
  });
}

/**
 * Sticky Header Scroll Listener
 */
function initStickyHeader() {
  const header = document.querySelector('.km-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

/**
 * FAQ Accordion Expansion Logic
 */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.km-faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.km-faq-trigger');
    const content = item.querySelector('.km-faq-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other open accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherContent = otherItem.querySelector('.km-faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle current accordion
      if (isOpen) {
        item.classList.remove('is-open');
        content.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/**
 * AJAX Cart Drawer Controls
 */
function initCartDrawer() {
  const drawer = document.getElementById('kmCartDrawer');
  const openBtns = document.querySelectorAll('[data-action="open-cart"]');
  const closeBtns = document.querySelectorAll('[data-action="close-cart"]');

  if (!drawer) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCartDrawer();
    });
  });

  // Global handle for add-to-cart forms
  document.querySelectorAll('form[action*="/cart/add"]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (res.ok) {
          await updateCartDrawerContent();
          openCartDrawer();
        } else {
          console.error('Cart add failed');
        }
      } catch (err) {
        console.error('Cart submission error', err);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}

function openCartDrawer() {
  const drawer = document.getElementById('kmCartDrawer');
  if (drawer) drawer.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer = document.getElementById('kmCartDrawer');
  if (drawer) drawer.classList.remove('is-open');
  document.body.style.overflow = '';
}

/**
 * Update Cart Drawer items via Shopify AJAX API
 */
async function updateCartDrawerContent() {
  try {
    const res = await fetch('/cart.js');
    if (!res.ok) return;
    const cart = await res.json();

    // Update cart badge counts across header
    document.querySelectorAll('.km-cart-badge').forEach(badge => {
      badge.textContent = cart.item_count;
    });

    const body = document.getElementById('kmCartDrawerBody');
    const footer = document.getElementById('kmCartDrawerFooter');

    if (cart.item_count === 0) {
      if (body) {
        body.innerHTML = `
          <div style="text-align: center; padding: 48px 0; color: var(--km-text-secondary);">
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 16px auto; opacity: 0.4;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <p style="font-family: var(--km-font-heading); font-size: 1.25rem;">Your Cart is Empty</p>
            <p style="font-size: 0.875rem; margin-top: 8px;">Explore our handcrafted swords and heritage collectibles.</p>
          </div>
        `;
      }
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    let itemsHtml = '';
    cart.items.forEach(item => {
      const priceFormatted = (item.final_price / 100).toLocaleString('en-IN', { style: 'currency', currency: cart.currency });
      itemsHtml += `
        <div style="display: flex; gap: 16px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: var(--km-border-subtle);">
          <img src="${item.image}" alt="${item.title}" style="width: 70px; height: 70px; object-fit: contain; background: #FFF; border-radius: var(--km-radius-sm); border: var(--km-border-subtle);" />
          <div style="flex-grow: 1;">
            <a href="${item.url}" style="font-family: var(--km-font-heading); font-weight: 600; font-size: 1.05rem;">${item.product_title}</a>
            <div style="font-size: 0.75rem; color: var(--km-text-secondary); margin: 4px 0;">${item.variant_title !== 'Default Title' ? item.variant_title : ''}</div>
            <div style="font-weight: 700; font-size: 0.9375rem;">${priceFormatted} x ${item.quantity}</div>
          </div>
        </div>
      `;
    });

    if (body) body.innerHTML = itemsHtml;

    const subtotal = (cart.total_price / 100).toLocaleString('en-IN', { style: 'currency', currency: cart.currency });
    const subtotalEl = document.getElementById('kmCartSubtotal');
    if (subtotalEl) subtotalEl.textContent = subtotal;

  } catch (err) {
    console.error('Failed to update cart drawer', err);
  }
}

/**
 * Quick View Modal Triggers & Dynamic Population
 */
function initQuickViewModal() {
  const modal = document.getElementById('kmQuickViewModal');
  const closeBtn = document.getElementById('kmQvClose');
  if (!modal) return;

  // Delegate quick view button clicks
  document.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('.km-quick-view-btn');
    if (!qvBtn) return;

    e.preventDefault();
    const card = qvBtn.closest('.km-product-card');
    if (!card) return;

    // Extract attributes
    const img = card.getAttribute('data-qv-img') || card.querySelector('.km-product-img')?.src;
    const title = card.getAttribute('data-qv-title') || card.querySelector('.km-product-title')?.textContent;
    const desc = card.getAttribute('data-qv-desc') || 'Handcrafted Rajput ceremonial sword forged in Amritsar, Punjab.';
    const price = card.getAttribute('data-qv-price') || card.querySelector('.km-price-current')?.textContent;
    const compare = card.getAttribute('data-qv-compare') || card.querySelector('.km-price-compare')?.textContent || '';
    const specsRaw = card.getAttribute('data-qv-specs') || 'Craft: Amritsar Forged|Material: Brass + Carbon Steel|Engraving: Free Laser Inscription|Dispatch: FedEx / DHL';
    const details = kmBuildQuickViewDetails(desc, specsRaw);

    // Populate modal
    const qvImg = document.getElementById('kmQvImage');
    const qvTitle = document.getElementById('kmQvTitle');
    const qvDesc = document.getElementById('kmQvDesc');
    const qvPrice = document.getElementById('kmQvPrice');
    const qvCompare = document.getElementById('kmQvCompare');
    const qvSpecs = document.getElementById('kmQvSpecs');

    if (qvImg) { qvImg.src = img; qvImg.alt = title; }
    if (qvTitle) qvTitle.textContent = title;
    if (qvDesc) qvDesc.textContent = details.description;
    if (qvPrice) qvPrice.textContent = price;
    if (qvCompare) qvCompare.textContent = compare;

    if (qvSpecs) {
      let specsHtml = '';
      details.specs.forEach(spec => {
        specsHtml += `
          <div class="km-qv-spec-row">
            <span class="km-qv-spec-key">${kmEscape(spec.key)}</span>
            <span class="km-qv-spec-val">${kmEscape(spec.value)}</span>
          </div>
        `;
      });

      if (!specsHtml) {
        specsHtml = `
          <div class="km-qv-spec-row">
            <span class="km-qv-spec-key">Craft</span>
            <span class="km-qv-spec-val">Amritsar Forged</span>
          </div>
          <div class="km-qv-spec-row">
            <span class="km-qv-spec-key">Dispatch</span>
            <span class="km-qv-spec-val">FedEx / DHL</span>
          </div>
        `;
      }

      qvSpecs.innerHTML = specsHtml;
    }

    // Show modal
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  // Close triggers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeQuickViewModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeQuickViewModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeQuickViewModal();
    }
  });
}

function closeQuickViewModal() {
  const modal = document.getElementById('kmQuickViewModal');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

/**
 * Autoplay Optimization for Hero Video
 */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('video[data-autoplay]');
  videos.forEach(v => {
    v.muted = true;
    v.play().catch(() => { });
  });
}

/**
 * Pause Marquee on Hover
 */
function initMarqueePause() {
  const marquee = document.querySelector('.km-marquee-track');
  if (!marquee) return;
  marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
  marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
}

/**
 * Lightweight Hardware-Accelerated Noise/Shimmer Effect
 * Replaces CPU-heavy per-pixel canvas manipulation with hardware-accelerated CSS variables.
 * Runs at 60/120fps smoothly on low-end Android and Windows devices.
 */
function initNoiseBackground() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cards = document.querySelectorAll('.km-noise-card, .km-product-card, .km-category-card');

  cards.forEach(card => {
    let ticking = false;
    card.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
        ticking = false;
      });
    }, { passive: true });
  });
}

/**
 * Segmented Tab Control Switcher with Animation
 */
function initSegmentedTabs() {
  const tabContainers = document.querySelectorAll('.km-segmented-tabs');

  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.km-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetCategory = tab.getAttribute('data-tab');
        if (targetCategory) {
          const items = document.querySelectorAll('[data-category]');
          items.forEach(item => {
            if (targetCategory === 'all' || item.getAttribute('data-category') === targetCategory) {
              item.style.display = '';
              // Restart animation
              item.classList.remove('km-card-animate');
              void item.offsetWidth; // trigger reflow
              item.classList.add('km-card-animate');
            } else {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

/**
 * 3D Parallax Tilt Effect on Hero Visual Box (Optimized with RAF & Pointer Query)
 */
function init3DTiltParallax() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const box = document.querySelector('.km-hero-visual-box');
  if (!box) return;

  let ticking = false;
  box.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 8;
      const rotateX = -((y - centerY) / centerY) * 8;

      box.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      ticking = false;
    });
  }, { passive: true });

  box.addEventListener('mouseleave', () => {
    box.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  });
}

/**
 * 3D Cinematic 3-Card Product Carousel State Machine & Autoplay Engine
 * Visually displays 3 cards simultaneously: CENTER (front/raised), LEFT (behind left), RIGHT (behind right)
 * Cards continuously rotate 1-by-1 into center.
 */
function init3DCinematicCarousel() {
  const stage = document.getElementById('km3dStage');
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll('.km-3d-card'));
  const dotsContainer = stage.querySelector('.km-3d-dots');
  const prevBtn = stage.querySelector('[data-3d-nav="prev"]');
  const nextBtn = stage.querySelector('[data-3d-nav="next"]');
  if (cards.length < 3) return;

  let currentIndex = 0; // Index of card in CENTER position
  let autoTimer = null;
  const ROTATION_INTERVAL = 4500; // Calm 4.5s product rotation

  // Render dots matching card count
  if (dotsContainer && !dotsContainer.children.length) {
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `km-3d-dot ${idx === 0 ? 'is-active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        pause();
        updatePositions(idx);
        resume();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

  function updatePositions(centerIdx) {
    currentIndex = (centerIdx + cards.length) % cards.length;
    const leftIdx = (currentIndex - 1 + cards.length) % cards.length;
    const rightIdx = (currentIndex + 1) % cards.length;

    cards.forEach((card, i) => {
      card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');
      if (i === currentIndex) {
        card.classList.add('is-center');
      } else if (i === leftIdx) {
        card.classList.add('is-left');
      } else if (i === rightIdx) {
        card.classList.add('is-right');
      } else {
        card.classList.add('is-hidden');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  function rotateNext() {
    updatePositions(currentIndex + 1);
  }

  function rotatePrev() {
    updatePositions(currentIndex - 1);
  }

  function startAutoplay() {
    if (!autoTimer) {
      autoTimer = setInterval(rotateNext, ROTATION_INTERVAL);
    }
  }

  function pause() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resume() {
    pause();
    startAutoplay();
  }

  // Initialize
  updatePositions(0);
  startAutoplay();

  // Control Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      pause();
      rotatePrev();
      resume();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      pause();
      rotateNext();
      resume();
    });
  }

  // Hover & Focus Pause
  stage.addEventListener('mouseenter', pause);
  stage.addEventListener('mouseleave', resume);
  stage.addEventListener('focusin', pause);
  stage.addEventListener('focusout', resume);

  // Direct card click to bring into center
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button, a')) return;
      if (i !== currentIndex) {
        pause();
        updatePositions(i);
        resume();
      }
    });
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      pause();
      if (diff < 0) rotateNext();
      else rotatePrev();
      resume();
    }
  }, { passive: true });
}

/**
 * Drag-to-Scroll Category Carousel
 */
function initCategoryDragCarousel() {
  const carousel = document.querySelector('.km-category-carousel');
  if (!carousel) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let autoTimer = null;
  let autoResumeTimer = null;
  let autoDirection = 1;
  const AUTO_STEP = 1;
  const AUTO_INTERVAL = 22;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    stopAutoScroll();
    carousel.classList.add('is-dragging');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('is-dragging');
    queueAutoResume();
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('is-dragging');
    queueAutoResume();
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });

  carousel.addEventListener('mouseenter', stopAutoScroll);
  carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
  carousel.addEventListener('touchend', queueAutoResume, { passive: true });

  function stopAutoScroll() {
    if (autoResumeTimer) {
      clearTimeout(autoResumeTimer);
      autoResumeTimer = null;
    }
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAutoScroll() {
    if (autoTimer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    autoTimer = setInterval(() => {
      if (isDown) return;

      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      if (maxScrollLeft <= 0) return;

      if (carousel.scrollLeft >= maxScrollLeft - 2) autoDirection = -1;
      if (carousel.scrollLeft <= 2) autoDirection = 1;

      carousel.scrollLeft += AUTO_STEP * autoDirection;
    }, AUTO_INTERVAL);
  }

  function queueAutoResume() {
    if (autoResumeTimer) clearTimeout(autoResumeTimer);
    autoResumeTimer = setTimeout(startAutoScroll, 1200);
  }

  startAutoScroll();
}

/**
 * Auto-Fading Testimonial Reviews Carousel
 */
function initTestimonialFadeSlider() {
  const slides = document.querySelectorAll('.km-testimonial-slide');
  if (!slides.length) return;

  let currentIndex = 0;

  setInterval(() => {
    slides[currentIndex].classList.remove('is-active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('is-active');
  }, 5000);
}

/**
 * Scroll Reveal Intersection Observer Animation
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.km-reveal, .km-section-header, .km-blog-card, .km-delivery-card');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  reveals.forEach(el => {
    if (!el.classList.contains('km-reveal')) el.classList.add('km-reveal');
    // Check if element is already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });
}

/**
 * Search Overlay Trigger & Dynamic Product Filter
 */
function initSearchOverlayModal() {
  const searchBtn = document.querySelector('.km-icon-btn[aria-label="Search"]');
  const searchOverlay = document.getElementById('kmSearchOverlay');
  const closeBtn = document.getElementById('kmSearchClose');
  const searchInput = document.getElementById('kmSearchInput');
  const resultsBox = document.getElementById('kmSearchResults');

  if (!searchOverlay) return;

  function openSearch() {
    searchOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 100);
  }

  function closeSearch() {
    searchOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearch);
  }

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) closeSearch();
  });

  if (searchInput && resultsBox) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      if (!query) {
        resultsBox.innerHTML = '';
        return;
      }
      const cards = Array.from(document.querySelectorAll('.km-product-card'));
      const matches = cards.filter(c => {
        const title = (c.getAttribute('data-qv-title') || c.querySelector('.km-product-title')?.textContent || '').toLowerCase();
        const desc = kmPlainTextFromHtml(c.getAttribute('data-qv-desc') || '').toLowerCase();
        return title.includes(query) || desc.includes(query);
      });

      if (!matches.length) {
        resultsBox.innerHTML = `<div style="color:var(--km-text-light);text-align:center;padding:24px;">No heritage products matching "${query}"</div>`;
        return;
      }

      resultsBox.innerHTML = matches.map(c => {
        const img = c.getAttribute('data-qv-img') || c.querySelector('img')?.src;
        const title = c.getAttribute('data-qv-title') || c.querySelector('.km-product-title')?.textContent;
        const price = c.getAttribute('data-qv-price') || c.querySelector('.km-price-current')?.textContent;
        return `
          <div style="display:flex;align-items:center;gap:16px;background:rgba(250,247,242,0.95);padding:12px 16px;border-radius:8px;cursor:pointer;" onclick="window.location.href='product-detail.html'">
            <img src="${img}" alt="${title}" style="width:50px;height:50px;object-fit:contain;" />
            <div style="flex-grow:1;">
              <strong style="color:var(--km-text-primary);display:block;font-family:var(--km-font-heading);font-size:1.05rem;">${title}</strong>
              <span style="color:var(--km-crimson-primary);font-weight:700;">${price}</span>
            </div>
            <span style="color:var(--km-gold-dark);font-size:0.85rem;font-weight:600;">View Product &rarr;</span>
          </div>
        `;
      }).join('');
    });
  }
}

/* ==========================================================================
   KRAFTMART — SCROLL REVEAL ENGINE v2.0
   IntersectionObserver-based scroll animations for all pages
   ========================================================================== */

(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    document.querySelectorAll('.km-reveal, .km-reveal-left, .km-reveal-right, .km-reveal-scale').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('km-is-visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe all reveal elements
  document.querySelectorAll('.km-reveal, .km-reveal-left, .km-reveal-right, .km-reveal-scale').forEach((el, i) => {
    // Auto-stagger cards in a grid if no explicit delay set
    if (!el.dataset.delay && el.closest('.km-product-grid, .km-blog-grid, .km-stats-grid')) {
      const siblings = Array.from(el.parentElement.querySelectorAll('.km-reveal'));
      const idx = siblings.indexOf(el);
      if (idx >= 0 && idx < 8) el.dataset.delay = String(idx + 1);
    }
    revealObserver.observe(el);
  });
})();

/* Stat counters: animate numbers when they scroll into view */
(function initStatCounters() {
  const statNums = document.querySelectorAll('.km-stat-number');
  if (!statNums.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9.K+★]/g, '');
      if (!raw || el.dataset.animated) return;
      el.dataset.animated = '1';
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(n => counterObserver.observe(n));
})();

/**
 * Hero Image Slider
 * Cross-fades between the three KraftMart sword images in the background
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.km-hero-slide');
  if (slides.length < 2) return;

  let current = 0;
  const INTERVAL = 4500;

  setInterval(() => {
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }, INTERVAL);
}

/**
 * Bubble Cursor Sensitivity (Desktop Only, Optimized with RAF & Target Isolation)
 * On mobile/touch devices, skipped entirely for maximum CPU/battery efficiency.
 */
function initBubbleSensitivity() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const hero = document.getElementById('km-hero');
  const bubbles = Array.from(document.querySelectorAll('.km-bubble'));
  if (!hero || !bubbles.length) return;

  const MAX_PUSH = 24;    // px max displacement
  const RADIUS = 140;   // px influence radius

  let rafId = null;
  let mx = -9999, my = -9999;

  hero.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(pushBubbles);
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    mx = -9999; my = -9999;
    bubbles.forEach(b => {
      b.style.setProperty('--bx', '0px');
      b.style.setProperty('--by', '0px');
    });
    rafId = null;
  });

  function pushBubbles() {
    rafId = null;
    bubbles.forEach(b => {
      const rect = b.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS && dist > 0) {
        const strength = (1 - dist / RADIUS) * MAX_PUSH;
        const pushX = (dx / dist) * strength;
        const pushY = (dy / dist) * strength;
        b.style.setProperty('--bx', `${pushX.toFixed(1)}px`);
        b.style.setProperty('--by', `${pushY.toFixed(1)}px`);
      } else {
        b.style.setProperty('--bx', '0px');
        b.style.setProperty('--by', '0px');
      }
    });
  }
}

/**
 * Product Bubble Click Navigation
 * Maps every floating sword bubble to its exact product detail page.
 * Clicking or pressing Enter on any product bubble navigates directly to that product.
 */
function initProductBubbleClicks(liveProducts = null) {
  const bubbles = document.querySelectorAll('.km-bubble');
  if (!bubbles.length) return;

  const fallbackMap = {
    'hero_talwar': {
      handle: 'jaipur-wedding-talwar',
      title: 'Jaipur Wedding Talwar'
    },
    'sword2': {
      handle: 'royal-jodhpur-damascus',
      title: 'Royal Jodhpur Damascus Talwar'
    },
    'sword': {
      handle: 'dawami-ceremonial-sword',
      title: 'Dawami Ceremonial Sword'
    }
  };

  bubbles.forEach((bubble, idx) => {
    const img = bubble.querySelector('img');
    const imgSrc = (img && img.getAttribute('src')) || '';
    let targetHandle = bubble.dataset.handle;
    let targetTitle = '';

    if (!targetHandle && liveProducts && liveProducts.length) {
      if (imgSrc.includes('hero_talwar') && liveProducts[0]) {
        targetHandle = liveProducts[0].handle;
        targetTitle = liveProducts[0].title;
      } else if (imgSrc.includes('sword2') && liveProducts[1]) {
        targetHandle = liveProducts[1].handle;
        targetTitle = liveProducts[1].title;
      } else if (imgSrc.includes('sword') && liveProducts[2]) {
        targetHandle = liveProducts[2].handle;
        targetTitle = liveProducts[2].title;
      } else {
        const prod = liveProducts[idx % liveProducts.length];
        targetHandle = prod?.handle;
        targetTitle = prod?.title;
      }
    }

    if (!targetHandle) {
      if (imgSrc.includes('hero_talwar')) {
        targetHandle = fallbackMap['hero_talwar'].handle;
        targetTitle = fallbackMap['hero_talwar'].title;
      } else if (imgSrc.includes('sword2')) {
        targetHandle = fallbackMap['sword2'].handle;
        targetTitle = fallbackMap['sword2'].title;
      } else {
        targetHandle = fallbackMap['sword'].handle;
        targetTitle = fallbackMap['sword'].title;
      }
    }

    const targetUrl = `product-detail.html?handle=${encodeURIComponent(targetHandle)}`;

    if (bubble.tagName.toLowerCase() === 'a') {
      bubble.href = targetUrl;
    } else {
      bubble.style.cursor = 'pointer';
      bubble.setAttribute('role', 'link');
      bubble.setAttribute('tabindex', '0');
      if (targetTitle) bubble.setAttribute('title', `View ${targetTitle} — Click to Open`);

      // Ensure click triggers navigation
      bubble.onclick = function(e) {
        e.stopPropagation();
        window.location.href = targetUrl;
      };

      bubble.onkeydown = function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = targetUrl;
        }
      };
    }
  });
}

function initLiveEngravingSimulator() {
  const input = document.getElementById('kmEngravingInput') || document.querySelector('.km-engraving-input');
  const preview = document.getElementById('kmEngravingPreviewText') || document.querySelector('.km-engraving-preview-text');
  const chips = document.querySelectorAll('.km-engraving-chip');

  if (!input || !preview) return;

  function updatePreview(val) {
    const text = val.trim();
    if (text) {
      preview.textContent = `“${text}”`;
    } else {
      preview.textContent = '“Gurpreet ❤️ Simran • 24.10.2026”';
    }
    preview.style.transform = 'scale(1.04)';
    setTimeout(() => {
      preview.style.transform = 'scale(1)';
    }, 150);
  }

  input.addEventListener('input', (e) => {
    updatePreview(e.target.value);
    chips.forEach(c => c.classList.remove('active'));
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const preset = chip.getAttribute('data-preset');
      if (preset) {
        input.value = preset;
        updatePreview(preset);
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        input.focus();
      }
    });
  });
}



