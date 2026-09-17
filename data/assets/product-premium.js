/**
 * Premium Product Page — Phase 1
 * Vanilla JS. No dependencies.
 */
(function () {
  'use strict';

  class ProductPremiumApp extends HTMLElement {
    connectedCallback() {
      this.section = this.closest('[data-pp-section]');
      this.gallery = this.querySelector('[data-pp-gallery]');
      this.track = this.querySelector('[data-pp-gallery-track]');
      this.slides = Array.from(this.querySelectorAll('[data-pp-slide]'));
      this.dots = Array.from(this.querySelectorAll('[data-pp-dot]'));
      this.counterCurrent = this.querySelector('[data-pp-current]');
      this.skeleton = this.querySelector('[data-pp-gallery-skeleton]');
      this.form = this.querySelector('[data-pp-product-form]');
      this.variantIdInput = this.querySelector('[data-pp-variant-id]');

      this.initGallerySkeleton();
      this.initGalleryScroll();
      this.initDots();
      this.initWishlist();
      this.initOptions();
      this.initQuantity();
      this.initButtons();
    }

    /* ---------------- Gallery ---------------- */

    initGallerySkeleton() {
      if (!this.skeleton) return;
      const firstImg = this.slides[0] && this.slides[0].querySelector('img');
      const hide = () => this.skeleton.classList.add('is-hidden');
      if (firstImg && firstImg.complete) {
        hide();
      } else if (firstImg) {
        firstImg.addEventListener('load', hide, { once: true });
        firstImg.addEventListener('error', hide, { once: true });
      } else {
        hide();
      }
    }

    initGalleryScroll() {
      if (!this.track) return;
      let ticking = false;
      this.track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          this.syncGalleryIndex();
          ticking = false;
        });
      }, { passive: true });
    }

    syncGalleryIndex() {
      const scrollLeft = this.track.scrollLeft;
      const width = this.track.clientWidth || 1;
      const index = Math.round(scrollLeft / width);
      this.setActiveSlide(index);
    }

    setActiveSlide(index) {
      if (this.counterCurrent) this.counterCurrent.textContent = index + 1;
      this.dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }

    initDots() {
      this.dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.dataset.index, 10);
          const target = this.slides[index];
          if (target && this.track) {
            this.track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
          }
        });
      });
    }

    /* ---------------- Wishlist ---------------- */

    initWishlist() {
      const btn = this.querySelector('[data-pp-wishlist]');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!pressed));
        btn.classList.toggle('is-active', !pressed);
      });
    }

    /* ---------------- Variant options ---------------- */

    initOptions() {
      this.optionFieldsets = Array.from(this.querySelectorAll('[data-pp-option]'));
      this.optionFieldsets.forEach((fieldset) => {
        const buttons = Array.from(fieldset.querySelectorAll('[data-pp-option-value]'));
        buttons.forEach((btn) => {
          btn.addEventListener('click', () => {
            buttons.forEach((b) => b.classList.remove('is-selected'));
            btn.classList.add('is-selected');
            const label = fieldset.querySelector('[data-pp-option-value]:not(button)');
            const legendValue = fieldset.querySelector('.pp-option__label span');
            if (legendValue) legendValue.textContent = btn.dataset.ppOptionValue;
            this.handleOptionChange();
          });
        });
      });
    }

    getSelectedOptions() {
      return this.optionFieldsets.map((fieldset) => {
        const selected = fieldset.querySelector('.is-selected');
        return selected ? selected.dataset.ppOptionValue : null;
      });
    }

    handleOptionChange() {
      // NOTE: Phase 1 assumes variant data is available via window.__ppProductVariants
      // (inject via a small inline JSON script from Liquid, or fetch product.js).
      // This keeps the section self-contained without requiring extra global state here.
      const event = new CustomEvent('pp:option-change', {
        bubbles: true,
        detail: { options: this.getSelectedOptions() }
      });
      this.dispatchEvent(event);

      // Pulse the primary CTA to acknowledge selection.
      const primaryBtn = this.querySelector('[data-pp-buy-now]');
      if (primaryBtn) {
        primaryBtn.classList.remove('pp-pulse');
        // Force reflow to restart animation
        void primaryBtn.offsetWidth;
        primaryBtn.classList.add('pp-pulse');
      }
    }

    /* ---------------- Quantity ---------------- */

    initQuantity() {
      const input = this.querySelector('[data-pp-qty-input]');
      const minus = this.querySelector('[data-pp-qty-minus]');
      const plus = this.querySelector('[data-pp-qty-plus]');
      if (!input) return;

      const clamp = (val) => Math.max(1, parseInt(val, 10) || 1);

      minus && minus.addEventListener('click', () => {
        input.value = clamp(parseInt(input.value, 10) - 1);
      });
      plus && plus.addEventListener('click', () => {
        input.value = clamp(parseInt(input.value, 10) + 1);
      });
      input.addEventListener('change', () => {
        input.value = clamp(input.value);
      });
    }

    /* ---------------- Buttons: ripple + buy now ---------------- */

    initButtons() {
      const buttons = this.querySelectorAll('.pp-btn');
      buttons.forEach((btn) => {
        btn.addEventListener('click', (e) => this.triggerRipple(btn, e));
      });

      const buyNowBtns = this.querySelectorAll('[data-pp-buy-now]');
      buyNowBtns.forEach((btn) => {
        btn.addEventListener('click', () => this.buyNow());
      });
    }

    triggerRipple(btn, e) {
      const ripple = btn.querySelector('.pp-btn__ripple') || document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = (e.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
      const y = (e.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.remove('is-active');
      void ripple.offsetWidth;
      ripple.classList.add('is-active');
    }

    buyNow() {
      if (!this.form) return;
      const formData = new FormData(this.form);
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then((res) => res.json())
        .then(() => {
          window.location.href = '/checkout';
        })
        .catch((err) => console.error('Buy Now failed:', err));
    }
  }

  customElements.define('product-premium-app', ProductPremiumApp);

  /* ---------------- Sticky bottom bar ---------------- */

  function initStickyBar() {
    const bar = document.getElementById('pp-sticky-bar');
    const primaryCta = document.querySelector('[data-pp-buy-now]');
    if (!bar || !primaryCta) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          bar.classList.toggle('is-visible', !entry.isIntersecting);
          bar.setAttribute('aria-hidden', String(entry.isIntersecting));
        });
      },
      { threshold: 0 }
    );
    observer.observe(primaryCta);

    const stickyBuyNow = document.getElementById('pp-sticky-buy-now');
    stickyBuyNow &&
      stickyBuyNow.addEventListener('click', () => {
        primaryCta.click();
      });
  }

  /* ---------------- Scroll to reviews ---------------- */

  function initScrollTargets() {
    document.querySelectorAll('[data-pp-scroll-target]').forEach((el) => {
      el.addEventListener('click', () => {
        const targetId = el.dataset.ppScrollTarget;
        const target = document.getElementById(targetId) || document.querySelector('[data-pp-accordion="' + targetId + '"]');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStickyBar();
    initScrollTargets();
  });
})();