/* ============================================================
   login.js — Login & Signup page logic
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────
   Tab switching
────────────────────────────────────────── */

const tabBtns   = document.querySelectorAll('.auth-tab-btn');
const formPanels = document.querySelectorAll('.auth-form');

function switchTab(targetTab) {
  tabBtns.forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.tab === targetTab);
  });

  formPanels.forEach(panel => {
    const isTarget = panel.id === 'form-' + targetTab;
    panel.classList.toggle('is-active', isTarget);
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

/* ──────────────────────────────────────────
   Password visibility toggle
────────────────────────────────────────── */

document.querySelectorAll('.field__toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.field__control').querySelector('.field__input');
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.innerHTML = isHidden ? iconEyeOff() : iconEye();
  });
});

function iconEye() {
  return `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function iconEyeOff() {
  return `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

/* ──────────────────────────────────────────
   Validation helpers
────────────────────────────────────────── */

function showFieldError(inputId, errId, show) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (!input || !err) return;
  input.classList.toggle('is-error', show);
  err.classList.toggle('is-visible', show);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ──────────────────────────────────────────
   Login form
────────────────────────────────────────── */

const loginBtn = document.getElementById('btn-login');

loginBtn.addEventListener('click', handleLogin);

// Also allow Enter key on inputs
document.querySelectorAll('#form-login .field__input').forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
});

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;

  let isValid = true;

  const emailOk = validateEmail(email);
  showFieldError('login-email', 'login-email-err', !emailOk);
  if (!emailOk) isValid = false;

  const passOk = pass.length > 0;
  showFieldError('login-pass', 'login-pass-err', !passOk);
  if (!passOk) isValid = false;

  if (!isValid) return;

  const users = getUsers();
  const matched = users.find(u => u.email === email && u.password === pass);

  if (!matched) {
    showToast('Incorrect email or password.', 'error');
    return;
  }

  setSessionUser(matched);
  showToast('Welcome back, ' + matched.name.split(' ')[0] + '!', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 900);
}

/* ──────────────────────────────────────────
   Signup form
────────────────────────────────────────── */

const signupBtn = document.getElementById('btn-signup');

signupBtn.addEventListener('click', handleSignup);

document.querySelectorAll('#form-signup .field__input').forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleSignup(); });
});

function handleSignup() {
  const name   = document.getElementById('su-name').value.trim();
  const email  = document.getElementById('su-email').value.trim();
  const pass   = document.getElementById('su-pass').value;
  const mobile = document.getElementById('su-mobile').value.trim();

  let isValid = true;

  showFieldError('su-name',   'su-name-err',   !name);
  if (!name) isValid = false;

  const emailOk = validateEmail(email);
  showFieldError('su-email',  'su-email-err',  !emailOk);
  if (!emailOk) isValid = false;

  const passOk = pass.length >= 6;
  showFieldError('su-pass',   'su-pass-err',   !passOk);
  if (!passOk) isValid = false;

  const mobileOk = /^\d{10}$/.test(mobile);
  showFieldError('su-mobile', 'su-mobile-err', !mobileOk);
  if (!mobileOk) isValid = false;

  if (!isValid) return;

  const users = getUsers();

  if (users.find(u => u.email === email)) {
    showToast('This email is already registered.', 'error');
    return;
  }

  const newUser = { name, email, password: pass, mobile };
  users.push(newUser);
  saveUsers(users);

  showToast('Account created! Please log in.', 'success');

  // Clear fields and switch to login
  document.getElementById('su-name').value   = '';
  document.getElementById('su-email').value  = '';
  document.getElementById('su-pass').value   = '';
  document.getElementById('su-mobile').value = '';

  setTimeout(() => switchTab('login'), 1000);
}

/* ──────────────────────────────────────────
   Switch links
────────────────────────────────────────── */

document.querySelectorAll('[data-switch]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchTab(link.dataset.switch);
  });
});
