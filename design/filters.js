// Testimonial filter buttons: All / Managers / Cross-functional partners / Peers
document.querySelectorAll('.filter').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var f = btn.dataset.filter;
    document.querySelectorAll('.filter').forEach(function (b) {
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    document.querySelectorAll('.quote').forEach(function (q) {
      q.hidden = !(f === 'all' || q.dataset.group === f);
    });
  });
});
