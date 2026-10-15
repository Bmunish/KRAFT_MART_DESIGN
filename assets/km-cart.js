/* Shopify's cart API is the only cart source of truth. */
(function () {
  'use strict';

  var config = window.KMShopify || {};
  var root = config.root || '/';
  var cart = { items: [], item_count: 0, total_price: 0, currency: config.currency || 'INR' };
  var busy = false;

  function url(path) { return root.replace(/\/$/, '/') + path.replace(/^\//, ''); }
  function escape(value) {
    var node = document.createElement('span');
    node.textContent = value == null ? '' : String(value);
    return node.innerHTML;
  }
  function money(cents) {
    var amount = Number(cents || 0) / 100;
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: cart.currency || config.currency || 'INR' }).format(amount); }
    catch (_) { return amount.toFixed(2); }
  }
  function toast(message, isError) {
    var el = document.getElementById('kmCartToastEl');
    if (!el) {
      el = document.createElement('div');
      el.id = 'kmCartToastEl';
      el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:99999;padding:12px 20px;border-radius:8px;background:#1A1410;color:#fff;';
      document.body.appendChild(el);
    }
    el.style.background = isError ? '#7A1E2E' : '#1A1410';
    el.textContent = message;
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.remove(); }, 3200);
  }
  async function request(path, options) {
    var response = await fetch(url(path), Object.assign({
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    }, options || {}));
    var data = await response.json();
    if (!response.ok) throw new Error(data.description || data.message || 'Shopify could not update the cart.');
    return data;
  }
  async function refresh() {
    cart = await request('cart.js', { cache: 'no-store' });
    render();
    return cart;
  }
  function render() {
    document.querySelectorAll('.km-cart-badge').forEach(function (badge) {
      badge.textContent = cart.item_count || 0;
      badge.style.display = cart.item_count ? '' : 'none';
    });
    var body = document.getElementById('kmCartDrawerBody');
    var footer = document.getElementById('kmCartDrawerFooter');
    var subtotal = document.getElementById('kmCartSubtotal');
    if (subtotal) subtotal.textContent = money(cart.total_price);
    if (!body) return;
    if (!cart.items.length) {
      body.innerHTML = '<div style="text-align:center;padding:56px 20px;color:var(--km-text-secondary)"><p style="font-family:var(--km-font-heading);font-size:1.2rem">Your Cart is Empty</p><a href="' + escape(url('collections/all')) + '" style="display:inline-block;margin-top:20px">Browse Products</a></div>';
      if (footer) footer.style.display = 'none';
      return;
    }
    if (footer) footer.style.display = '';
    body.innerHTML = cart.items.map(function (item) {
      var image = item.image || '';
      return '<div class="km-cart-item" style="display:flex;gap:14px;margin-bottom:18px;padding-bottom:18px;border-bottom:var(--km-border-subtle);align-items:flex-start">' +
        '<a href="' + escape(item.url || '#') + '" style="flex-shrink:0"><img src="' + escape(image) + '" alt="' + escape(item.product_title || item.title) + '" style="width:72px;height:72px;object-fit:contain;background:#fff;border-radius:6px" loading="lazy"></a>' +
        '<div style="flex:1;min-width:0"><a href="' + escape(item.url || '#') + '" style="font-weight:600;display:block">' + escape(item.product_title || item.title) + '</a>' +
        (item.variant_title && item.variant_title !== 'Default Title' ? '<div style="font-size:.78rem;color:var(--km-text-secondary)">' + escape(item.variant_title) + '</div>' : '') +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px"><div class="km-qv-stepper" style="gap:0">' +
        '<button type="button" class="km-qv-qty-btn" data-cart-qty="-1" data-key="' + escape(item.key) + '" aria-label="Decrease quantity">−</button><span class="km-qv-qty-val" style="width:32px">' + item.quantity + '</span>' +
        '<button type="button" class="km-qv-qty-btn" data-cart-qty="1" data-key="' + escape(item.key) + '" aria-label="Increase quantity">+</button></div><strong>' + money(item.final_line_price) + '</strong></div></div>' +
        '<button type="button" data-cart-remove="' + escape(item.key) + '" aria-label="Remove ' + escape(item.product_title || item.title) + '" style="background:none;border:0;cursor:pointer;font-size:1.2rem">×</button></div>';
    }).join('');
  }
  function openDrawer() {
    var drawer = document.getElementById('kmCartDrawer');
    if (drawer) drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  async function add(variantId, quantity, properties) {
    if (!variantId) throw new Error('This product has no Shopify variant. Please choose another product.');
    await request('cart/add.js', { method: 'POST', body: JSON.stringify({ id: Number(variantId), quantity: Math.max(1, Number(quantity) || 1), properties: properties || {} }) });
    await refresh();
  }
  async function findVariant(handle) {
    if (!handle) throw new Error('This product is not connected to a Shopify product.');
    var product = await request('products/' + encodeURIComponent(handle) + '.js');
    var variant = (product.variants || []).find(function (item) { return item.available; });
    if (!variant) throw new Error('This product is currently unavailable.');
    return variant.id;
  }
  function productProperties(form) {
    var input = document.querySelector('.km-engraving-input');
    var value = input && input.value.trim();
    return value ? { 'Engraving instructions': value } : {};
  }

  document.addEventListener('click', async function (event) {
    var checkout = event.target.closest('#kmCartCheckout');
    if (checkout) {
      event.preventDefault();
      try {
        var note = document.querySelector('#kmCartDrawerFooter [name="note"]');
        if (note) await request('cart/update.js', { method: 'POST', body: JSON.stringify({ note: note.value }) });
        await refresh();
        if (!cart.item_count) throw new Error('Your cart is empty.');
        window.location.assign(url('checkout'));
      } catch (error) { toast(error.message, true); }
      return;
    }

    var change = event.target.closest('[data-cart-qty], [data-cart-remove]');
    if (change) {
      event.preventDefault();
      if (busy) return;
      busy = true;
      try {
        var qty = change.hasAttribute('data-cart-remove') ? 0 : Math.max(0, (cart.items.find(function (item) { return item.key === change.dataset.key; }) || {}).quantity + Number(change.dataset.cartQty));
        await request('cart/change.js', { method: 'POST', body: JSON.stringify({ id: change.dataset.key, quantity: qty }) });
        await refresh();
      } catch (error) { toast(error.message, true); }
      finally { busy = false; }
      return;
    }

    var quickBuy = event.target.closest('#kmQvBuyNowBtn');
    if (quickBuy) {
      event.preventDefault();
      try {
        var modal = document.getElementById('kmQuickViewModal');
        var handle = modal && modal.dataset.productHandle;
        var variantId = modal && modal.dataset.variantId || await findVariant(handle);
        var qty = Number((document.getElementById('kmQvQtyVal') || {}).textContent) || 1;
        await add(variantId, qty, productProperties());
        window.location.assign(url('checkout'));
      } catch (error) { toast(error.message, true); }
      return;
    }

    var buyNow = event.target.closest('.km-btn-buy-now-solid');
    if (buyNow) {
      event.preventDefault();
      var form = buyNow.closest('form');
      if (!form || busy) return;
      busy = true;
      try {
        var data = new FormData(form);
        await add(data.get('id'), data.get('quantity'), productProperties(form));
        window.location.assign(url('checkout'));
      } catch (error) { toast(error.message, true); }
      finally { busy = false; }
      return;
    }

    var addButton = event.target.closest('.km-add-cart-btn, #kmQvAddToCartBtn');
    if (addButton) {
      event.preventDefault();
      var card = addButton.closest('.km-product-card');
      if (busy) return;
      busy = true;
      addButton.disabled = true;
      try {
        var form = addButton.closest('form');
        var variantId = (form && new FormData(form).get('id')) || (card && card.dataset.variantId);
        var handle = (card && card.dataset.handle) || (document.getElementById('kmQuickViewModal') || {}).dataset.productHandle;
        if (!variantId) variantId = await findVariant(handle);
        var quantity = form ? (new FormData(form).get('quantity') || 1) : Number((document.getElementById('kmQvQtyVal') || {}).textContent) || 1;
        await add(variantId, quantity, productProperties(form));
        var modal = document.getElementById('kmQuickViewModal');
        if (addButton.id === 'kmQvAddToCartBtn' && modal) modal.classList.remove('is-open');
        openDrawer();
      } catch (error) { toast(error.message, true); }
      finally { busy = false; addButton.disabled = false; }
    }
  });

  document.addEventListener('submit', async function (event) {
    var form = event.target.closest('form[action*="/cart/add"]');
    if (!form || event.submitter && event.submitter.classList.contains('km-btn-buy-now-solid')) return;
    event.preventDefault();
    if (busy) return;
    busy = true;
    try {
      var data = new FormData(form);
      await add(data.get('id'), data.get('quantity'), productProperties(form));
      openDrawer();
    } catch (error) { toast(error.message, true); }
    finally { busy = false; }
  });

  var noteTimer;
  document.addEventListener('input', function (event) {
    if (!event.target.matches('#kmCartDrawerFooter [name="note"]')) return;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () {
      request('cart/update.js', { method: 'POST', body: JSON.stringify({ note: event.target.value }) }).catch(function () {});
    }, 500);
  });

  document.addEventListener('DOMContentLoaded', function () {
    localStorage.removeItem('km_cart_v2');
    refresh().catch(function () { render(); });
  });
  if (document.readyState !== 'loading') {
    localStorage.removeItem('km_cart_v2');
    refresh().catch(function () { render(); });
  }
})();
