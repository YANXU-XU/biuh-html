(function () {
  'use strict';

  var machine = document.getElementById('machine');
  var toggle = document.getElementById('machine-switch');
  var status = document.getElementById('machine-status');
  var count = document.getElementById('switch-count');

  if (!machine || !toggle || !status || !count) return;

  var attempts = 0;
  var isBusy = false;

  toggle.addEventListener('click', function () {
    if (isBusy) return;

    isBusy = true;
    toggle.disabled = true;
    machine.classList.remove('is-photo-visible', 'is-retracting');
    document.getElementById('machine-photo').setAttribute('aria-hidden', 'true');
    machine.classList.add('is-firing');
    status.textContent = 'Click. Developing your portrait...';

    window.setTimeout(function () {
      machine.classList.remove('is-firing');
      machine.classList.add('is-photo-visible');
      document.getElementById('machine-photo').setAttribute('aria-hidden', 'false');
      attempts += 1;
      count.textContent = String(attempts).padStart(2, '0');
      toggle.setAttribute('aria-label', 'Take another photo');
      status.textContent = 'Your portrait is ready. Press the shutter for another.';
    }, 420);

    window.setTimeout(function () {
      machine.classList.remove('is-firing');
      toggle.disabled = false;
      isBusy = false;
      toggle.setAttribute('aria-label', 'Take another photo');
      status.textContent = 'Ready when you are.';
    }, 1500);
  });
})();