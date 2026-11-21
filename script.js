/**
 * SHIRLEY DHLAMINI & MDUMO GAMA
 * Digital Wedding Invitation — JavaScript
 *
 * EDITABLE CONFIGURATION:
 * - WEDDING_DATE: Set to 20 February 2027
 * - VENUE_ADDRESS: Replace with actual venue address for Google Maps
 * - REGISTRY_URL: Replace with actual registry URL
 */

'use strict';

/* ----------------------------------------------------------------
   CONFIGURATION — Edit these values
   ---------------------------------------------------------------- */
const CONFIG = {
  weddingDate: new Date('2027-02-20T09:00:00'),   // Wedding date — ceremony starts 09:00 AM
  venueAddress: '[Venue Address, City, Province]',  // EDITABLE: Replace with actual address
  registryUrl: '#',                                 // EDITABLE: Replace with registry URL
};

/* ----------------------------------------------------------------
   DOM READY
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initCountdown();
  initRSVP();
  initVenueMap();
  initRegistryLink();
  initScrollReveal();
});

/* ================================================================
   1. ENVELOPE ANIMATION
   ================================================================ */
function initEnvelope() {
  const envelope     = document.getElementById('envelope');
  const envScreen    = document.getElementById('envelope-screen');
  const main         = document.getElementById('invitation-main');
  const tapHint      = document.querySelector('.env-tap');
  let opened = false;

  if (!envelope || !envScreen || !main) return;

  // Allow both click and keyboard activation
  ['click', 'keydown'].forEach(evt => {
    envelope.addEventListener(evt, (e) => {
      if (evt === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      if (opened) return;
      openEnvelope();
    });
  });

  function openEnvelope() {
    opened = true;

    // Hide tap hint
    if (tapHint) {
      tapHint.style.opacity = '0';
      tapHint.style.transition = 'opacity 0.3s ease';
    }

    // Open flap
    envelope.classList.add('is-open');
    envelope.setAttribute('aria-label', 'Opening your invitation…');

    // After card slides out, transition to main content
    setTimeout(() => {
      // Fade out envelope screen
      envScreen.classList.add('env-hidden');
      envScreen.setAttribute('aria-hidden', 'true');

      // Show main invitation
      main.setAttribute('aria-hidden', 'false');
      main.classList.add('is-visible');
      document.body.style.overflow = '';

      // Set focus to main content for accessibility
      setTimeout(() => {
        const firstHeading = main.querySelector('h1, h2');
        if (firstHeading) firstHeading.tabIndex = -1, firstHeading.focus();
      }, 200);
    }, 1600);
  }

  // Prevent background scroll while envelope is showing
  document.body.style.overflow = 'hidden';
}

/* ================================================================
   2. COUNTDOWN TIMER
   ================================================================ */
function initCountdown() {
  const daysEl    = document.getElementById('cdDays');
  const hoursEl   = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');
  const timerEl   = document.getElementById('countdownTimer');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !timerEl) return;

  function updateCountdown() {
    const now    = new Date();
    const target = CONFIG.weddingDate;
    const diff   = target - now;

    if (diff <= 0) {
      // Wedding day has arrived or passed
      timerEl.innerHTML = `
        <p class="countdown-wedding-day">Today is the Day! 💍</p>
      `;
      clearInterval(countdownInterval);
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setNumber(daysEl,    String(days).padStart(3, '0'));
    setNumber(hoursEl,   String(hours).padStart(2, '0'));
    setNumber(minutesEl, String(minutes).padStart(2, '0'));
    setNumber(secondsEl, String(seconds).padStart(2, '0'));
  }

  // Animate number change
  function setNumber(el, value) {
    if (el.textContent !== value) {
      el.classList.add('number-flip');
      el.textContent = value;
      setTimeout(() => el.classList.remove('number-flip'), 300);
    }
  }

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
}

/* ================================================================
   3. RSVP FORM
   ================================================================ */
function initRSVP() {
  const openBtn     = document.getElementById('rsvpOpenBtn');
  const formWrapper = document.getElementById('rsvpFormWrapper');
  const form        = document.getElementById('rsvpForm');
  const success     = document.getElementById('rsvpSuccess');

  if (!openBtn || !formWrapper || !form) return;

  // Toggle form visibility
  openBtn.addEventListener('click', () => {
    const isOpen = formWrapper.classList.contains('is-open');
    formWrapper.classList.toggle('is-open');
    formWrapper.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    openBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    openBtn.textContent = isOpen ? 'Confirm Attendance' : 'Hide Form';

    if (!isOpen) {
      // Scroll to form
      setTimeout(() => {
        formWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });

  // Show/hide guest count based on attendance
  const attendingInputs = form.querySelectorAll('input[name="attending"]');
  const guestCountGroup = document.getElementById('guestCountGroup');

  attendingInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (guestCountGroup) {
        guestCountGroup.style.display = input.value === 'yes' ? 'block' : 'none';
      }
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    // Collect form data (ready for backend integration)
    const formData = collectFormData(form);
    console.log('RSVP submitted:', formData);
    // TODO: Connect to backend/database here
    // Example: fetch('/api/rsvp', { method: 'POST', body: JSON.stringify(formData), headers: { 'Content-Type': 'application/json' }})

    // Show success
    form.style.display = 'none';
    if (success) {
      success.classList.add('is-visible');
      success.setAttribute('aria-live', 'polite');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

function validateForm(form) {
  let isValid = true;
  clearErrors(form);

  // Required text/email/tel fields
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (field.type === 'radio') return; // Handle separately
    if (!field.value.trim()) {
      showError(field, 'This field is required.');
      isValid = false;
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
      showError(field, 'Please enter a valid email address.');
      isValid = false;
    }
  });

  // Radio group validation
  const attendingGroup = form.querySelectorAll('input[name="attending"]');
  const attendingChecked = [...attendingGroup].some(r => r.checked);
  if (!attendingChecked) {
    const errorEl = form.querySelector('.form-radio-group + .form-error, [role="radiogroup"] ~ .form-error');
    if (!errorEl) {
      // Find the form-error after the radio group
      const radioGroupParent = form.querySelector('.form-radio-group');
      if (radioGroupParent) {
        const nextError = radioGroupParent.closest('.form-group')?.querySelector('.form-error');
        if (nextError) {
          nextError.textContent = 'Please select your attendance.';
        }
      }
    }
    isValid = false;
  }

  // Guest count — only required if attending
  const attending = form.querySelector('input[name="attending"]:checked');
  if (attending && attending.value === 'yes') {
    const guestCount = form.querySelector('#guestCount');
    if (guestCount && !guestCount.value) {
      showError(guestCount, 'Please select the number of guests.');
      isValid = false;
    }
  }

  // Focus first invalid field
  if (!isValid) {
    const firstInvalid = form.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();
  }

  return isValid;
}

function showError(field, message) {
  field.classList.add('is-invalid');
  const group = field.closest('.form-group');
  if (group) {
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }
}

function clearErrors(form) {
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  form.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function collectFormData(form) {
  const data = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    data[key] = value;
  });
  data.submittedAt = new Date().toISOString();
  data.weddingCouple = 'Shirley Dhlamini & Mdumo Gama';
  data.weddingDate = '20 February 2027';
  return data;
}

/* ================================================================
   4. VENUE MAP BUTTON
   ================================================================ */
function initVenueMap() {
  const mapBtn   = document.getElementById('venueMapBtn');
  const modal    = document.getElementById('mapModal');
  const backdrop = document.getElementById('mapBackdrop');
  const closeBtn = document.getElementById('mapClose');
  if (!mapBtn || !modal) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    mapBtn.focus();
  }

  mapBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}

/* ================================================================
   5. REGISTRY LINK
   ================================================================ */
function initRegistryLink() {
  const registryBtn = document.getElementById('registryBtn');
  if (!registryBtn) return;

  if (CONFIG.registryUrl && CONFIG.registryUrl !== '#') {
    registryBtn.href = CONFIG.registryUrl;
    registryBtn.target = '_blank';
    registryBtn.rel = 'noopener noreferrer';
  } else {
    registryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Registry details will be added soon!');
    });
  }
}

/* ================================================================
   6. SCROLL REVEAL
   ================================================================ */
function initScrollReveal() {
  // Add reveal class to key elements
  const revealTargets = [
    { selector: '.inv-eyebrow',          delay: 0 },
    { selector: '.inv-bride',            delay: 1 },
    { selector: '.inv-and',              delay: 2 },
    { selector: '.inv-groom',            delay: 3 },
    { selector: '.inv-request',          delay: 4 },
    { selector: '.inv-date-block',       delay: 5 },
    { selector: '.story-text',           delay: 1 },
    { selector: '.story-photo-frame',    delay: 2 },
    { selector: '.countdown-timer',      delay: 2 },
    { selector: '.countdown-subtitle',   delay: 1 },
    { selector: '.details-item',         delay: 0 },
    { selector: '.venue-photo-wrapper',  delay: 1 },
    { selector: '.venue-details',        delay: 2 },
    { selector: '.dresscode-illustrations', delay: 1 },
    { selector: '.dresscode-palette',    delay: 2 },
    { selector: '.dresscode-message',    delay: 3 },
    { selector: '.rsvp-card',            delay: 1 },
    { selector: '.gifts-text',           delay: 1 },
    { selector: '.gifts-banking',        delay: 2 },
    { selector: '.footer-names',         delay: 1 },
    { selector: '.footer-date',          delay: 2 },
  ];

  revealTargets.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      el.classList.add('reveal');
      if (delay > 0) {
        el.classList.add(`reveal--delay-${Math.min(delay + idx, 5)}`);
      }
    });
  });

  // Also add section headings
  document.querySelectorAll('.section-heading, .section-eyebrow').forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  // Intersection Observer for scroll-based reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Re-run observer when envelope is opened to catch newly visible elements
  const main = document.getElementById('invitation-main');
  if (main) {
    const mainObserver = new MutationObserver(() => {
      document.querySelectorAll('.reveal:not(.is-revealed)').forEach(el => {
        observer.observe(el);
      });
    });
    mainObserver.observe(main, { attributes: true, attributeFilter: ['class'] });
  }
}

/* ================================================================
   7. UTILITY — Smooth scroll polyfill for older iOS
   ================================================================ */
(function smoothScrollPolyfill() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ================================================================
   8. NUMBER FLIP ANIMATION (injected CSS)
   ================================================================ */
(function injectFlipStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes numberFlip {
      0%   { transform: translateY(-8px); opacity: 0; }
      100% { transform: translateY(0);    opacity: 1; }
    }
    .number-flip {
      animation: numberFlip 0.3s ease forwards;
    }
  `;
  document.head.appendChild(style);
})();
