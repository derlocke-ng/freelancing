/* Läuft synchron im <head>: setzt das gespeicherte Farbschema vor dem ersten
   Rendern (kein Aufblitzen) und markiert, dass JavaScript verfügbar ist. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var theme = localStorage.getItem('ml-theme');
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  } catch (e) { /* Speicher nicht verfügbar: Systemeinstellung gilt */ }
})();
