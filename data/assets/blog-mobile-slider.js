/**
 * Blog Mobile Slider — Auto-scroll + Arrow Navigation
 * Vanilla JS, no external libraries. Defer-loaded.
 * Targets: .blog-mobile-slider-wrapper
 */
(function () {
  'use strict';

  function initBlogSlider(wrapper) {
    const slider = wrapper.querySelector('.blog-mobile-slider-track');
    const prevBtn = wrapper.querySelector('.blog-arrow--prev');
    const nextBtn = wrapper.querySelector('.blog-arrow--next');

    if (!slider || !prevBtn || !nextBtn) return;

    const slides = Array.from(slider.querySelectorAll('.slider__slide'));
    if (slides.length === 0) return;

    let autoScrollTimer = null;
    let resumeTimer = null;
    let isUserInteracting = false;
    const SCROLL_INTERVAL = 3500; // ms per card

    // ── Helpers ───────────────────────────────────────────────────────────────
    function getCardWidth() {
      if (slides[0]) {
        const style = getComputedStyle(slides[0]);
        return slides[0].offsetWidth + parseInt(style.marginRight || 0, 10);
      }
      return slider.offsetWidth * 0.85;
    }

    function getCurrentIndex() {
      const cardW = getCardWidth();
      return Math.round(slider.scrollLeft / cardW);
    }

    function scrollToIndex(index) {
      const count = slides.length;
      const safeIndex = ((index % count) + count) % count; // wrap
      const cardW = getCardWidth();
      slider.scrollTo({ left: safeIndex * cardW, behavior: 'smooth' });
    }

    // ── Arrow buttons ─────────────────────────────────────────────────────────
    prevBtn.addEventListener('click', function () {
      stopAutoScroll();
      scrollToIndex(getCurrentIndex() - 1);
      scheduleResume();
    });

    nextBtn.addEventListener('click', function () {
      stopAutoScroll();
      scrollToIndex(getCurrentIndex() + 1);
      scheduleResume();
    });

    // ── Auto-scroll ───────────────────────────────────────────────────────────
    function autoScrollStep() {
      const next = getCurrentIndex() + 1;
      const count = slides.length;
      // wrap: if at last, jump to first
      if (next >= count) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollToIndex(next);
      }
    }

    function startAutoScroll() {
      if (autoScrollTimer) return;
      autoScrollTimer = setInterval(autoScrollStep, SCROLL_INTERVAL);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }

    function scheduleResume() {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () {
        if (!isUserInteracting) startAutoScroll();
      }, 3000);
    }

    // ── Pause on touch / swipe ────────────────────────────────────────────────
    slider.addEventListener('touchstart', function () {
      isUserInteracting = true;
      stopAutoScroll();
    }, { passive: true });

    slider.addEventListener('touchend', function () {
      isUserInteracting = false;
      scheduleResume();
    }, { passive: true });

    slider.addEventListener('mouseenter', function () {
      stopAutoScroll();
    });

    slider.addEventListener('mouseleave', function () {
      if (!isUserInteracting) startAutoScroll();
    });

    // ── Intersection Observer — only auto-scroll when visible ─────────────────
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startAutoScroll();
          } else {
            stopAutoScroll();
          }
        });
      }, { threshold: 0.2 });
      io.observe(wrapper);
    } else {
      startAutoScroll();
    }
  }

  // ── Init all blog sliders on the page ─────────────────────────────────────
  function init() {
    document.querySelectorAll('.blog-mobile-slider-wrapper').forEach(initBlogSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
