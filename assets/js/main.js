/* Maximilian Locke – IT Freelancer
   Kleine Verbesserungen für alle Seiten. Die Seite funktioniert auch ohne
   JavaScript; nichts hier lädt Daten nach oder sendet Daten irgendwohin. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THEME_COLORS = { dark: '#0b0e13', light: '#f6f7f9' };

  /* ---------- Farbschema ---------- */
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function syncTheme() {
    var theme = currentTheme();
    document.querySelectorAll('.js-theme').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Helles Farbschema aktivieren' : 'Dunkles Farbschema aktivieren');
      btn.setAttribute('title', theme === 'dark' ? 'Helles Farbschema' : 'Dunkles Farbschema');
    });
    if (root.hasAttribute('data-theme')) {
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
        meta.setAttribute('content', THEME_COLORS[theme]);
      });
    }
  }

  document.querySelectorAll('.js-theme').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ml-theme', next); } catch (e) { /* nur für diese Sitzung */ }
      syncTheme();
    });
  });
  syncTheme();
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', syncTheme);

  /* ---------- Kopfzeile & mobiles Menü ---------- */
  var header = document.querySelector('.site-header');
  var menuBtn = document.querySelector('.js-menu');

  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (header && menuBtn) {
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    menuBtn.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });
    header.querySelectorAll('.site-nav a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        menuBtn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    window.matchMedia('(min-width: 1041px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- Aktiver Navigationspunkt (nur auf der Startseite) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  if (navLinks.length && sections.length) {
    var spyQueued = false;
    var spy = function () {
      spyQueued = false;
      var mark = window.innerHeight * 0.4;
      var current = null;
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= mark) current = section;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', !!current && link.getAttribute('href') === '#' + current.id);
      });
    };
    window.addEventListener('scroll', function () {
      if (!spyQueued) { spyQueued = true; window.requestAnimationFrame(spy); }
    }, { passive: true });
    spy();
  }

  /* ---------- Terminal im Hero: tippt die Befehle nach ---------- */
  var term = document.querySelector('.js-terminal');
  if (term && !reduceMotion && 'IntersectionObserver' in window) {
    var lines = Array.prototype.slice.call(term.querySelectorAll('.t-line'));
    var commands = lines.map(function (line) {
      var cmd = line.querySelector('.t-cmd');
      return cmd ? cmd.textContent : null;
    });
    term.style.minHeight = term.offsetHeight + 'px';
    lines.forEach(function (line) {
      line.hidden = true;
      var cmd = line.querySelector('.t-cmd');
      if (cmd) cmd.textContent = '';
    });

    var wait = function (ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); };
    var play = async function () {
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var cmd = line.querySelector('.t-cmd');
        line.hidden = false;
        if (cmd && commands[i]) {
          line.classList.add('is-typing');
          await wait(420);
          for (var c = 0; c < commands[i].length; c++) {
            cmd.textContent += commands[i].charAt(c);
            await wait(16 + Math.random() * 38);
          }
          await wait(240);
          line.classList.remove('is-typing');
        } else {
          await wait(110);
        }
      }
    };

    var termObserver = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        termObserver.disconnect();
        play();
      }
    }, { threshold: 0.35 });
    termObserver.observe(term);
  }

  /* ---------- Sanftes Einblenden beim Scrollen ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && !reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('reveal-ready');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Projektfilter (projekte.html) ---------- */
  var filterBar = document.querySelector('.js-filters');
  if (filterBar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.js-project'));
    var buttons = Array.prototype.slice.call(filterBar.querySelectorAll('[data-filter]'));
    var resultCount = document.querySelector('.js-result-count');
    var matches = function (card, filter) {
      return filter === 'alle' || (card.getAttribute('data-cat') || '').split(' ').indexOf(filter) !== -1;
    };

    buttons.forEach(function (btn) {
      var filter = btn.getAttribute('data-filter');
      var count = btn.querySelector('.count');
      if (count) count.textContent = cards.filter(function (card) { return matches(card, filter); }).length;
    });

    var applyFilter = function (filter, updateUrl) {
      var shown = 0;
      cards.forEach(function (card) {
        var ok = matches(card, filter);
        card.hidden = !ok;
        if (ok) shown++;
      });
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === filter));
      });
      if (resultCount) resultCount.textContent = shown + (shown === 1 ? ' Projekt' : ' Projekte');
      if (updateUrl && window.history && history.replaceState) {
        var url = filter === 'alle' ? location.pathname : location.pathname + '?filter=' + encodeURIComponent(filter);
        history.replaceState(null, '', url);
      }
    };

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { applyFilter(btn.getAttribute('data-filter'), true); });
    });
    var requested = new URLSearchParams(location.search).get('filter');
    var known = buttons.some(function (btn) { return btn.getAttribute('data-filter') === requested; });
    applyFilter(known ? requested : 'alle', false);
  }

  /* ---------- Anfrage-Assistent: baut eine E-Mail, sendet selbst nichts ---------- */
  var form = document.querySelector('.js-inquiry');
  if (form) {
    var to = form.getAttribute('data-mailto');
    var status = form.querySelector('.js-form-status');
    var value = function (name) {
      var field = form.elements[name];
      return field ? String(field.value).trim() : '';
    };
    var compose = function () {
      var topic = value('thema');
      var lines = ['Guten Tag,', '', value('nachricht'), '', '---', 'Thema: ' + topic, 'Zeitrahmen: ' + (value('zeitrahmen') || 'noch offen')];
      if (value('firma')) lines.push('Firma/Organisation: ' + value('firma'));
      lines.push('', 'Viele Grüße', value('name'));
      return { subject: 'Projektanfrage: ' + topic, body: lines.join('\r\n') };
    };
    var say = function (text) { if (status) status.textContent = text; };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var mail = compose();
      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(mail.subject) +
        '&body=' + encodeURIComponent(mail.body);
      say('Ihr E-Mail-Programm sollte sich jetzt öffnen. Falls nicht: „Text kopieren“ nutzen und an ' + to + ' senden.');
    });

    var copyBtn = form.querySelector('.js-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        if (!form.reportValidity()) return;
        var mail = compose();
        var text = 'An: ' + to + '\r\nBetreff: ' + mail.subject + '\r\n\r\n' + mail.body;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () {
            say('Kopiert – fügen Sie den Text in eine E-Mail an ' + to + ' ein.');
          }, function () {
            say('Kopieren nicht möglich. Schreiben Sie mir gern direkt an ' + to + '.');
          });
        } else {
          say('Kopieren nicht möglich. Schreiben Sie mir gern direkt an ' + to + '.');
        }
      });
    }
  }

  /* ---------- Kleinigkeiten ---------- */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
  document.querySelectorAll('.js-path').forEach(function (el) {
    el.textContent = decodeURIComponent(location.pathname);
  });
})();
