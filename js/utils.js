/* ============================================================
   utils.js — Shared utility functions
   ============================================================ */

'use strict';

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|''} type
 */
function showToast(message, type = '') {
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast${type ? ' toast--' + type : ''}`;

  // Trigger reflow so transition plays
  void toast.offsetWidth;
  toast.classList.add('toast--show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('toast--show');
  }, 3200);
}

/**
 * Get all users from localStorage
 * @returns {Array}
 */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('qm_users') || '[]');
  } catch {
    return [];
  }
}

/**
 * Save users array to localStorage
 * @param {Array} users
 */
function saveUsers(users) {
  localStorage.setItem('qm_users', JSON.stringify(users));
}

/**
 * Get logged-in user from sessionStorage
 * @returns {Object|null}
 */
function getSessionUser() {
  try {
    return JSON.parse(sessionStorage.getItem('qm_session') || 'null');
  } catch {
    return null;
  }
}

/**
 * Save session user
 * @param {Object} user
 */
function setSessionUser(user) {
  sessionStorage.setItem('qm_session', JSON.stringify(user));
}

/**
 * Clear session and redirect to login
 */
function logout() {
  sessionStorage.removeItem('qm_session');
  window.location.href = 'index.html';
}

/**
 * Format a number nicely (up to 8 significant figures)
 * @param {number} n
 * @returns {string}
 */
function formatNum(n) {
  if (isNaN(n) || !isFinite(n)) return '—';
  const sig = parseFloat(n.toPrecision(8));
  return sig.toLocaleString(undefined, { maximumFractionDigits: 6 });
}
