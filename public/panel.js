// Skripti i vogël i panelit /admin (skedar i veçantë, që CSP "script-src 'self'" ta lejojë).
// Pa të, paneli punon njësoj, vetëm menuja në telefon mbetet e hapur dhe butonat "Kopjo" nuk shfaqen.
(function () {
  // Menuja anësore: e hapur në ekran të gjerë, e mbyllur në telefon.
  var menu = document.querySelector('.anash .menu');
  var gjere = window.matchMedia('(min-width: 901px)');
  function rregulloMenune() { if (menu) menu.open = gjere.matches; }
  rregulloMenune();
  gjere.addEventListener('change', rregulloMenune);

  // Butonat "Kopjo adresën" te faqja e skedarëve.
  document.querySelectorAll('[data-kopjo]').forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () {
      var tekstiPara = b.textContent;
      var vlera = location.origin + (b.getAttribute('data-kopjo') || '');
      function perfundo(tekst) { b.textContent = tekst; setTimeout(function () { b.textContent = tekstiPara; }, 2000); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(vlera).then(function () { perfundo('U kopjua'); }, function () { perfundo('Kopjoje me dorë'); });
      } else {
        perfundo('Kopjoje me dorë');
      }
    });
  });
})();
