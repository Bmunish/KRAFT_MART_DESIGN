/**
 * KRAFTMART — CART ENGINE v3
 * localStorage-backed cart. Single source of truth.
 * Shopify deploy: swap localStorage calls with /cart/add.js, /cart.js, /cart/change.js
 * ponytail: no deps, ~260 lines.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'km_cart_v2';
  var _rendering = false; // debounce guard

  // ── Storage ────────────────────────────────────────────────────────────────

  function readCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (_) { return []; }
  }

  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Sync badge + subtotal immediately — do NOT call renderCartDrawer from here
    // to avoid recursive render loops. Let callers do that.
    syncBadges();
    syncSubtotal();
  }

  // ── Purge invalid items (stale data from pre-fix sessions) ─────────────────

  function purgeInvalid() {
    var items = readCart();
    var clean = items.filter(function(i) { return i.price > 0 && i.title && i.id; });
    if (clean.length !== items.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    }
    return clean;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  window.KMCart = {
    get: readCart,
    count: function() { return readCart().reduce(function(n, i) { return n + i.qty; }, 0); },
    total: function() { return readCart().reduce(function(s, i) { return s + i.price * i.qty; }, 0); },

    add: function(item) {
      var items = readCart();
      var existing = items.filter(function(i) { return i.id === item.id; })[0];
      if (existing) {
        existing.qty = Math.min(99, existing.qty + (item.qty || 1));
      } else {
        items.push({ id: item.id, handle: item.handle || '', variantId: item.variantId || '',
                     title: item.title, image: item.image, variant: item.variant || '',
                     price: item.price, qty: item.qty || 1 });
      }
      writeCart(items);
      return items;
    },

    update: function(id, qty) {
      var items = readCart();
      var idx = -1;
      items.forEach(function(i, n) { if (i.id === id) idx = n; });
      if (idx === -1) return items;
      if (qty <= 0) items.splice(idx, 1);
      else items[idx].qty = Math.min(99, qty);
      writeCart(items);
      return items;
    },

    remove: function(id) {
      var items = readCart().filter(function(i) { return i.id !== id; });
      writeCart(items);
      return items;
    },

    clear: function() { writeCart([]); }
  };

  // ── Formatting ─────────────────────────────────────────────────────────────

  function fmtPrice(inr) {
    var cur = localStorage.getItem('km_currency') || 'INR';
    if (cur === 'USD') return '$' + Math.round(inr / 85).toLocaleString('en-US');
    return '\u20b9' + Number(inr).toLocaleString('en-IN');
  }

  // ── Badge sync ─────────────────────────────────────────────────────────────

  function syncBadges() {
    var count = KMCart.count();
    document.querySelectorAll('.km-cart-badge').forEach(function(b) {
      b.textContent = count;
      b.style.display = count > 0 ? '' : 'none';
    });
  }

  // ── Subtotal sync — independent of body render ─────────────────────────────

  function syncSubtotal() {
    var total = KMCart.total();
    var el = document.getElementById('kmCartSubtotal');
    if (el) el.textContent = fmtPrice(total);
    // Also update checkout button label if cart is open
    var footer = document.getElementById('kmCartDrawerFooter');
    if (footer) footer.style.display = KMCart.count() > 0 ? '' : 'none';
  }

  // ── Escaping ────────────────────────────────────────────────────────────────

  function esc(str) {
    var d = document.createElement('span');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function escAttr(str) {
    return String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                            .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Cart Drawer render ─────────────────────────────────────────────────────

  function renderCartDrawer() {
    if (_rendering) return; // prevent re-entrant double-render
    _rendering = true;

    var body = document.getElementById('kmCartDrawerBody');
    var footer = document.getElementById('kmCartDrawerFooter');
    if (!body) { _rendering = false; return; }

    var items = KMCart.get();

    if (!items.length) {
      body.innerHTML =
        '<div style="text-align:center;padding:56px 20px;color:var(--km-text-secondary);">' +
        '<svg width="52" height="52" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24" style="margin:0 auto 16px;display:block;opacity:0.35;">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>' +
        '<p style="font-family:var(--km-font-heading);font-size:1.2rem;margin-bottom:8px;">Your Cart is Empty</p>' +
        '<p style="font-size:0.875rem;">Explore our handcrafted heritage swords.</p>' +
        '<a href="products.html" style="display:inline-block;margin-top:20px;padding:10px 24px;background:var(--km-gold-primary);color:#0E0A08;border-radius:6px;font-weight:700;font-size:0.875rem;text-decoration:none;">Browse Products</a>' +
        '</div>';
      if (footer) footer.style.display = 'none';
      _rendering = false;
      return;
    }

    if (footer) footer.style.display = '';

    body.innerHTML = items.map(function(item) {
      var lineTotal = fmtPrice(item.price * item.qty);
      return '<div class="km-cart-item" data-id="' + escAttr(item.id) + '" style="display:flex;gap:14px;margin-bottom:18px;padding-bottom:18px;border-bottom:var(--km-border-subtle);">' +
        '<a href="product-detail.html?handle=' + escAttr(item.handle) + '" style="flex-shrink:0;">' +
        '<img src="' + escAttr(item.image) + '" alt="' + escAttr(item.title) + '" style="width:72px;height:72px;object-fit:contain;background:#FFF;border-radius:6px;border:var(--km-border-subtle);" loading="lazy" decoding="async"/>' +
        '</a>' +
        '<div style="flex-grow:1;min-width:0;">' +
        '<a href="product-detail.html?handle=' + escAttr(item.handle) + '" style="font-family:var(--km-font-heading);font-weight:600;font-size:0.95rem;display:block;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(item.title) + '</a>' +
        (item.variant ? '<div style="font-size:0.74rem;color:var(--km-text-secondary);margin-bottom:6px;">' + esc(item.variant) + '</div>' : '') +
        '<div style="display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap;">' +
        '<div class="km-qv-stepper" style="gap:0;">' +
        '<button type="button" class="km-qv-qty-btn km-cart-qty-dec" style="width:32px;height:32px;font-size:1.1rem;" data-id="' + escAttr(item.id) + '" aria-label="Decrease">\u2212</button>' +
        '<span class="km-qv-qty-val" style="width:32px;font-size:0.9rem;">' + item.qty + '</span>' +
        '<button type="button" class="km-qv-qty-btn km-cart-qty-inc" style="width:32px;height:32px;font-size:1.1rem;" data-id="' + escAttr(item.id) + '" aria-label="Increase">+</button>' +
        '</div>' +
        '<strong style="font-size:0.95rem;" class="km-line-total">' + lineTotal + '</strong>' +
        '</div></div>' +
        '<button type="button" class="km-cart-remove" data-id="' + escAttr(item.id) + '" aria-label="Remove" style="align-self:flex-start;padding:4px;color:var(--km-text-secondary);font-size:1.2rem;line-height:1;background:none;border:none;cursor:pointer;flex-shrink:0;opacity:0.6;">\u00d7</button>' +
        '</div>';
    }).join('');

    // Always write subtotal from fresh KMCart.total() AFTER body is rendered
    syncSubtotal();

    // Wire checkout button
    var checkoutBtn = footer && footer.querySelector('.km-btn-gold, [class*="btn-gold"]');
    if (checkoutBtn) {
      checkoutBtn.onclick = function() {
        var lines = KMCart.get().map(function(i) {
          return '\u2022 ' + i.title + ' \u00d7 ' + i.qty + ' \u2014 ' + fmtPrice(i.price * i.qty);
        }).join('\n');
        alert('Checkout requires the live Shopify store.\nVisit kraftmart.shop to complete your purchase.\n\n' + lines + '\n\nTotal: ' + fmtPrice(KMCart.total()));
      };
    }

    // Wire +/- and remove via event delegation on body (avoids stale closures)
    body.onclick = function(e) {
      var dec = e.target.closest && e.target.closest('.km-cart-qty-dec');
      var inc = e.target.closest && e.target.closest('.km-cart-qty-inc');
      var rem = e.target.closest && e.target.closest('.km-cart-remove');

      if (dec) {
        var id = dec.dataset.id;
        var cur = KMCart.get().filter(function(i) { return i.id === id; })[0];
        if (cur) KMCart.update(id, cur.qty - 1);
        // Re-render after storage update
        _rendering = false;
        renderCartDrawer();
        return;
      }
      if (inc) {
        var id2 = inc.dataset.id;
        var cur2 = KMCart.get().filter(function(i) { return i.id === id2; })[0];
        if (cur2) KMCart.update(id2, cur2.qty + 1);
        _rendering = false;
        renderCartDrawer();
        return;
      }
      if (rem) {
        KMCart.remove(rem.dataset.id);
        showCartToast('Item removed from cart.');
        _rendering = false;
        renderCartDrawer();
        return;
      }
    };

    _rendering = false;
  }

  // ── Toast ──────────────────────────────────────────────────────────────────

  function showCartToast(msg, isError) {
    var t = document.getElementById('kmCartToastEl');
    if (!t) {
      t = document.createElement('div');
      t.id = 'kmCartToastEl';
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);' +
        'background:var(--km-bg-dark,#1A1410);color:#FAF7F2;padding:12px 24px;border-radius:8px;' +
        'font-size:0.875rem;font-weight:600;border:1px solid rgba(197,160,89,0.4);' +
        'box-shadow:0 8px 32px rgba(0,0,0,0.35);z-index:9999;' +
        'transition:transform 0.3s ease,opacity 0.3s ease;opacity:0;pointer-events:none;' +
        'max-width:340px;text-align:center;white-space:pre-line;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = isError ? '#7A1E2E' : 'var(--km-bg-dark,#1A1410)';
    t.style.transform = 'translateX(-50%) translateY(0)';
    t.style.opacity = '1';
    clearTimeout(t._t);
    t._t = setTimeout(function() {
      t.style.transform = 'translateX(-50%) translateY(80px)';
      t.style.opacity = '0';
    }, 2800);
  }

  // ── Build item from product card ──────────────────────────────────────────

  function buildItemFromCard(card) {
    var handle = card.dataset.handle || '';
    var variantId = card.dataset.variantId || '';
    var title = card.dataset.qvTitle ||
                (card.querySelector('.km-product-title') && card.querySelector('.km-product-title').textContent.trim()) ||
                'KraftMart Product';
    var image = card.dataset.qvImg || (card.querySelector('img') && card.querySelector('img').src) || 'assets/sword.png';

    // data-inr-price is the authoritative source (set directly on <article> by kmProductCard)
    var price = parseInt(String(card.dataset.inrPrice || card.dataset.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
    if (!price) {
      var priceEl = card.querySelector('.km-price-current');
      if (priceEl) price = parseInt((priceEl.dataset.inrPrice || priceEl.textContent).replace(/[^0-9]/g, ''), 10) || 0;
    }

    var id = variantId || handle || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return { id: id, handle: handle, variantId: variantId, title: title, image: image, variant: '', price: price };
  }

  function openCartDrawer() {
    var drawer = document.getElementById('kmCartDrawer');
    if (drawer) { drawer.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    renderCartDrawer(); // always re-render fresh on open
  }

  // ── Global Add to Cart delegation ─────────────────────────────────────────

  function wireAddToCart() {
    document.body.addEventListener('click', function(e) {

      // Product card Add to Cart button
      var addBtn = e.target.closest && e.target.closest('.km-add-cart-btn');
      if (addBtn) {
        var card = addBtn.closest('.km-product-card') || addBtn.closest('[data-qv-title]');
        if (!card) return;
        e.preventDefault();
        var item = buildItemFromCard(card);
        if (!item.price) { showCartToast('Price not available. Please refresh the page.', true); return; }
        KMCart.add(item);
        renderCartDrawer();
        showCartToast('\u2713 ' + item.title.split(/[|\u2013\u2014]/)[0].trim() + ' added to cart');
        openCartDrawer();
        return;
      }

      // Quick View Add to Cart
      var qvAdd = e.target.closest && e.target.closest('#kmQvAddToCartBtn');
      if (qvAdd) {
        e.preventDefault();
        var t = (document.getElementById('kmQvTitle') || {}).textContent || 'Heritage Product';
        var img = (document.getElementById('kmQvImage') || {}).src || 'assets/sword.png';
        var pt = (document.getElementById('kmQvPrice') || {}).textContent || '0';
        var price = parseInt(pt.replace(/[^0-9]/g, ''), 10) || 0;
        var handle = t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        var qty = parseInt(((document.getElementById('kmQvQtyVal') || {}).textContent || '1'), 10) || 1;
        if (!price) { showCartToast('Price not available.', true); return; }
        KMCart.add({ id: handle, handle: handle, title: t.trim(), image: img, variant: '', price: price, qty: qty });
        renderCartDrawer();
        showCartToast('\u2713 ' + t.trim().split(/[|\u2013\u2014]/)[0].trim() + ' added to cart');
        var qv = document.getElementById('kmQuickViewModal');
        if (qv) { qv.classList.remove('is-open'); document.body.classList.remove('modal-open'); }
        openCartDrawer();
        return;
      }

      // Quick View Buy Now
      var qvBuy = e.target.closest && e.target.closest('#kmQvBuyNowBtn');
      if (qvBuy) {
        e.preventDefault();
        var t2 = (document.getElementById('kmQvTitle') || {}).textContent || 'Heritage Product';
        var img2 = (document.getElementById('kmQvImage') || {}).src || 'assets/sword.png';
        var pt2 = (document.getElementById('kmQvPrice') || {}).textContent || '0';
        var price2 = parseInt(pt2.replace(/[^0-9]/g, ''), 10) || 0;
        var handle2 = t2.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        var qty2 = parseInt(((document.getElementById('kmQvQtyVal') || {}).textContent || '1'), 10) || 1;
        KMCart.add({ id: handle2, handle: handle2, title: t2.trim(), image: img2, variant: '', price: price2, qty: qty2 });
        var qv2 = document.getElementById('kmQuickViewModal');
        if (qv2) { qv2.classList.remove('is-open'); document.body.classList.remove('modal-open'); }
        alert('Checkout requires the live Shopify store at kraftmart.shop\n\nAdded: ' + t2.trim() + '\nCart Total: ' + fmtPrice(KMCart.total()));
        return;
      }
    });
  }

  // ── PDP buttons ────────────────────────────────────────────────────────────

  function wirePdpButtons() {
    var addBtn = document.querySelector('[data-product-add]');
    var buyBtn = document.querySelector('.km-btn-buy-now-solid');
    if (!addBtn && !buyBtn) return;

    function getPdpItem() {
      var titleEl = document.querySelector('[data-product-title]');
      var title = titleEl ? titleEl.textContent.trim() : document.title;
      var imgEl = document.getElementById('kmPdpMainImage') || document.querySelector('.km-qv-img-box img');
      var image = imgEl ? imgEl.src : 'assets/sword.png';
      var priceEl = document.querySelector('[data-product-price] .km-qv-price') || document.querySelector('.km-qv-price');
      var price = priceEl ? parseInt((priceEl.dataset.inrPrice || priceEl.textContent).replace(/[^0-9]/g, ''), 10) || 0 : 0;
      var handle = new URLSearchParams(window.location.search).get('handle') || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      var qtyEl = document.getElementById('kmPdpQtyVal') || document.getElementById('kmQvQtyVal');
      var qty = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;
      var engEl = document.querySelector('.km-engraving-input');
      var variant = (engEl && engEl.value.trim()) ? 'Engraving: "' + engEl.value.trim() + '"' : '';
      return { id: handle, handle: handle, title: title, image: image, variant: variant, price: price, qty: qty };
    }

    if (addBtn) {
      addBtn.removeAttribute('data-action');
      addBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var item = getPdpItem();
        if (!item.price) { showCartToast('Product unavailable. Please refresh.', true); return; }
        addBtn.disabled = true;
        var orig = addBtn.textContent;
        addBtn.textContent = 'Adding\u2026';
        setTimeout(function() {
          KMCart.add(item);
          renderCartDrawer();
          showCartToast('\u2713 ' + item.title.split(/[|\u2013\u2014]/)[0].trim() + ' added to cart');
          addBtn.disabled = false;
          addBtn.textContent = orig;
          openCartDrawer();
        }, 300);
      });
    }

    if (buyBtn) {
      buyBtn.removeAttribute('data-action');
      buyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var item = getPdpItem();
        if (!item.price) { showCartToast('Product unavailable. Please refresh.', true); return; }
        buyBtn.disabled = true;
        buyBtn.textContent = 'Processing\u2026';
        setTimeout(function() {
          KMCart.add(item);
          buyBtn.disabled = false;
          buyBtn.textContent = 'Buy it now';
          alert('Checkout requires the live Shopify store at kraftmart.shop\n\nAdded: ' + item.title + '\nCart Total: ' + fmtPrice(KMCart.total()));
        }, 400);
      });
    }
  }

  // ── Boot ───────────────────────────────────────────────────────────────────

  function boot() {
    // Remove stale items with invalid prices from previous sessions
    purgeInvalid();
    // Migrate: clear stale v2 data if any item has price=0 (pre-fix corruption)
    var _raw = localStorage.getItem(STORAGE_KEY);
    if (_raw) {
      try {
        var _check = JSON.parse(_raw) || [];
        if (_check.some(function(i) { return !i.price || i.price <= 0; })) {
          localStorage.removeItem(STORAGE_KEY);
          console.log('[KMCart] Purged stale cart data with invalid prices.');
        }
      } catch(_e) { localStorage.removeItem(STORAGE_KEY); }
    }


    syncBadges();
    syncSubtotal();
    renderCartDrawer();
    wireAddToCart();
    wirePdpButtons();

    // Re-render when cart drawer opens
    document.body.addEventListener('click', function(e) {
      if (e.target.closest && e.target.closest('[data-action="open-cart"]')) {
        openCartDrawer();
      }
    });

    // Cross-tab storage sync
    window.addEventListener('storage', function(e) {
      if (e.key === STORAGE_KEY) {
        syncBadges();
        syncSubtotal();
        var drawer = document.getElementById('kmCartDrawer');
        if (drawer && drawer.classList.contains('is-open')) renderCartDrawer();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
