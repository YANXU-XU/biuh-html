/* ============================================
   nav.js —— 全站交互
   - 主题切换 / 汉堡菜单 / 回到顶部
   - 滚动淡入 / 复制语录 / 表单校验
   ============================================ */

(function () {
  'use strict';

  /* ---------- 1. 汉堡菜单 ---------- */
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('header nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. 主题切换 ---------- */
  function initTheme() {
    var toggle = document.querySelector('.theme-toggle');
    var root = document.documentElement;
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- 3. 回到顶部 ---------- */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&uarr;';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 4. 滚动淡入 ---------- */
  function initRevealOnScroll() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < targets.length; i++) targets[i].classList.add('visible');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 5. 复制语录 ---------- */
  function initCopyQuotes() {
    var buttons = document.querySelectorAll('.copy-btn');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var card = btn.closest('.quote');
        var text = card && card.dataset.quote;
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            var original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.textContent = original;
              btn.classList.remove('copied');
            }, 1500);
          }).catch(function () {
            btn.textContent = 'Select & Copy';
            setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
          });
        } else {
          btn.textContent = 'Not supported';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        }
      });
    });
  }

  /* ---------- 6. 表单校验 ---------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var fields = {
      name:    { el: form.name,    test: function (v) { return v.trim().length >= 2; },  msg: 'Please enter at least 2 characters.' },
      email:   { el: form.email,   test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, msg: 'Please enter a valid email address.' },
      message: { el: form.message, test: function (v) { return v.trim().length >= 10; }, msg: 'Message must be at least 10 characters.' }
    };

    function showError(key, msg) {
      var el = document.querySelector('.error[data-for="' + key + '"]');
      if (el) el.textContent = msg || '';
      fields[key].el.classList.toggle('invalid', Boolean(msg));
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('input', function () { showError(key, ''); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      Object.keys(fields).forEach(function (key) {
        var f = fields[key];
        if (!f.test(f.el.value)) {
          showError(key, f.msg);
          valid = false;
        }
      });

      var status = form.querySelector('.form-status');
      if (valid) {
        status.textContent = '✅ Thanks! Your message has been sent (demo).';
        status.className = 'form-status success';
        form.reset();
      } else {
        status.textContent = 'Please fix the errors above.';
        status.className = 'form-status error-text';
      }
    });
  }

  /* ---------- 7. 启动 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initTheme();
    initBackToTop();
    initRevealOnScroll();
    initCopyQuotes();
    initContactForm();
  });

})();