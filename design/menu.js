// Phone menu: the "Menu" button shows and hides the navigation links on small screens.
// Without JavaScript the button stays hidden and the links show as normal.
(function () {
  var header = document.querySelector('.site-header');
  var button = header && header.querySelector('.menu-toggle');
  if (!button) return;

  button.hidden = false;

  function setOpen(open) {
    header.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  button.addEventListener('click', function () {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  // Close after choosing a link
  header.querySelectorAll('.site-nav a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  // Close with the Escape key, and put keyboard focus back on the button
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });

  // Close when tapping anywhere else on the page
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) setOpen(false);
  });

  // Close if the screen gets wide enough to show the full menu
  window.matchMedia('(min-width: 720px)').addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();
