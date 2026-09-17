/**
 * category-mobile-slider.js
 * Mobile-only navigation arrows for the "Featured By Category" section.
 * Vanilla JS — no external libraries.
 * Scoped to: .category-slider-wrapper
 */

(function () {
  'use strict';

  function initCategorySlider(wrapper) {
    var track = wrapper.querySelector('.category-slider-track');
    var btnPrev = wrapper.querySelector('.cat-arrow--prev');
    var btnNext = wrapper.querySelector('.cat-arrow--next');

    if (!track || !btnPrev || !btnNext) return;

    // Only run on mobile
    function isMobile() {
      return window.innerWidth <= 749;
    }

    // Amount to scroll per click = width of one card item
    function getScrollAmount() {
      var firstItem = track.querySelector('.slider__slide, .collection-list__item, .grid__item');
      if (firstItem) return firstItem.offsetWidth + 16; // card width + gap
      return 180;
    }

    function updateArrows() {
      if (!isMobile()) {
        btnPrev.style.opacity = '0';
        btnPrev.style.pointerEvents = 'none';
        btnNext.style.opacity = '0';
        btnNext.style.pointerEvents = 'none';
        return;
      }

      var scrollLeft = track.scrollLeft;
      var maxScroll = track.scrollWidth - track.clientWidth;

      // Left arrow: only visible when scrolled right
      if (scrollLeft <= 4) {
        btnPrev.style.opacity = '0';
        btnPrev.style.pointerEvents = 'none';
        btnPrev.setAttribute('aria-hidden', 'true');
      } else {
        btnPrev.style.opacity = '1';
        btnPrev.style.pointerEvents = 'auto';
        btnPrev.removeAttribute('aria-hidden');
      }

      // Right arrow: fade out at end
      if (scrollLeft >= maxScroll - 4) {
        btnNext.style.opacity = '0';
        btnNext.style.pointerEvents = 'none';
        btnNext.setAttribute('aria-hidden', 'true');
      } else {
        btnNext.style.opacity = '1';
        btnNext.style.pointerEvents = 'auto';
        btnNext.removeAttribute('aria-hidden');
      }
    }

    btnPrev.addEventListener('click', function () {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    btnNext.addEventListener('click', function () {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });

    // Initial state
    updateArrows();
  }

  function init() {
    var wrappers = document.querySelectorAll('.category-slider-wrapper');
    wrappers.forEach(function (wrapper) {
      initCategorySlider(wrapper);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
