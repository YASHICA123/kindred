/* Greenfield International School — standalone interactions (no dependencies) */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Toast ---------- */
  let toastTimer;
  function showToast(msg) {
    const t = $('#gis-toast');
    $('#gis-toast-msg').textContent = msg;
    t.classList.add('open');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('open'), 4200);
  }

  /* ---------- Modal ---------- */
  const overlay = $('#gis-modal');
  const card = $('#gis-modal-card');
  const modalConfig = {
    apply:    ['Apply Now', 'Start your application to Greenfield International School.', 'enq'],
    callback: ['Request a Callback', "Share your details and we'll call you back shortly.", 'enq'],
    visit:    ['Schedule a Visit', "Tell us a bit about your child and we'll confirm a slot.", 'enq'],
    fee:      ['Download Fee Structure', 'Get the complete 2026\u201327 fee sheet on your mobile.', 'fee'],
    review:   ['Share your experience', 'Help other parents with an honest review.', 'review']
  };
  function openModal(mode, title, subtitle) {
    card.classList.remove('is-fee', 'is-review');
    if (mode === 'fee') card.classList.add('is-fee');
    if (mode === 'review') card.classList.add('is-review');
    $('#gis-modal-title').textContent = title;
    $('#gis-modal-subtitle').textContent = subtitle;
    $('#gis-enq-err').textContent = '';
    $('#gis-rev-err').textContent = '';
    overlay.classList.add('open');
  }
  function closeModal() { overlay.classList.remove('open'); }

  $$('[data-act]').forEach(btn => {
    const c = modalConfig[btn.dataset.act];
    if (c) btn.addEventListener('click', () => openModal(c[2], c[0], c[1]));
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Form validation ---------- */
  function validate(form, fields, errEl) {
    for (const f of fields) {
      const el = form.querySelector('[name="' + f + '"]');
      const val = (el ? el.value : '').trim();
      if (!val) { errEl.textContent = 'Please complete all fields to continue.'; return false; }
      if (f.indexOf('mobile') >= 0 && !/^\d{10}$/.test(val)) {
        errEl.textContent = 'Please enter a valid 10-digit mobile number.'; return false;
      }
    }
    errEl.textContent = '';
    return true;
  }
  const COUNSELLOR_MSG = 'Thank you! Our admission counsellor will reach out within 24 hours.';

  $('#gis-enq-form').addEventListener('submit', e => {
    e.preventDefault();
    if (validate(e.target, ['name', 'mobile', 'klass'], $('#gis-enq-err'))) {
      e.target.reset(); closeModal(); showToast(COUNSELLOR_MSG);
    }
  });
  $('#gis-sv-form').addEventListener('submit', e => {
    e.preventDefault();
    if (validate(e.target, ['name', 'mobile', 'klass', 'date'], $('#gis-sv-err'))) {
      e.target.reset(); showToast(COUNSELLOR_MSG);
    }
  });
  $('#gis-fg-form').addEventListener('submit', e => {
    e.preventDefault();
    if (validate(e.target, ['name', 'mobile', 'klass', 'city'], $('#gis-fg-err'))) {
      e.target.reset(); showToast(COUNSELLOR_MSG);
    }
  });
  $('#gis-rev-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = e.target.querySelector('[name="name"]').value.trim();
    const text = e.target.querySelector('[name="review"]').value.trim();
    if (!name || !text) { $('#gis-rev-err').textContent = 'Please add your name and a short review.'; return; }
    e.target.reset(); setStars(5); closeModal();
    showToast('Thanks for sharing! Your review is pending approval.');
  });

  /* ---------- Star rating ---------- */
  const stars = $$('#gis-stars span');
  function setStars(n) { stars.forEach((s, i) => s.textContent = (i < n ? '\u2605' : '\u2606')); }
  stars.forEach((s, i) => s.addEventListener('click', () => setStars(i + 1)));
  setStars(5);

  /* ---------- Accordions (FAQ + withdrawal) ---------- */
  $$('.gis-acc-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.parentElement.querySelector('.gis-collapsible');
      if (!body) return;
      const open = body.classList.toggle('open');
      const sign = btn.querySelector('.gis-acc-sign');
      if (sign) sign.textContent = open ? '\u2212' : '+';
    });
  });

  /* ---------- Read more ---------- */
  $$('[data-readmore]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.readmore);
      if (!target) return;
      const open = target.classList.toggle('open');
      const label = btn.querySelector('.gis-rm-label');
      const chev = btn.querySelector('.gis-rm-chev');
      if (label) label.textContent = open ? btn.dataset.lessLabel : btn.dataset.moreLabel;
      if (chev) chev.textContent = open ? '\u25B2' : '\u25BC';
    });
  });

  /* ---------- Gallery tabs ---------- */
  const galLabels = ['Campus', 'Classroom', 'Sports', 'Activity'];
  const tabs = $$('.gis-tab');
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => {
      tabs.forEach(x => { x.style.background = '#f3f5f9'; x.style.color = '#5b6b86'; });
      b.style.background = '#122a5e'; b.style.color = '#fff';
      $('#gis-gal-main').textContent = galLabels[i] + ' photo \u00b7 drop image here';
    });
  });
})();
