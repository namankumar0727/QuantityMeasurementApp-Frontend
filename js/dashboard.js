/* ============================================================
   dashboard.js — Dashboard logic: conversions, comparison, arithmetic
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────
   Auth guard — redirect if not logged in
────────────────────────────────────────── */

const currentUser = getSessionUser();
if (!currentUser) {
  window.location.href = 'index.html';
}

// Populate nav
document.getElementById('nav-username').textContent = currentUser.name.split(' ')[0];
document.getElementById('nav-avatar').textContent   = currentUser.name.charAt(0).toUpperCase();

document.getElementById('btn-logout').addEventListener('click', logout);

/* ──────────────────────────────────────────
   Unit definitions
────────────────────────────────────────── */

// Units exactly as shown in the app reference video
const UNITS = {
  length: [
    'Millimeter',
    'Centimeter',
    'Meter',
    'Kilometer'
  ],
  weight: [
    'Gram',
    'Kilogram',
    'Tonne'
  ],
  temperature: [
    'Celsius',
    'Fahrenheit',
    'Kelvin'
  ],
  volume: [
    'Milliliter',
    'Liter',
    'Cubic Meter'
  ]
};

// Conversion factors to SI base unit
const TO_BASE = {
  length: {
    Millimeter: 0.001,
    Centimeter: 0.01,
    Meter:      1,
    Kilometer:  1000
  },
  weight: {
    Gram:      1,
    Kilogram:  1000,
    Tonne:     1000000
  },
  volume: {
    Milliliter:    0.001,
    Liter:         1,
    'Cubic Meter': 1000
  }
};

/**
 * Convert a value from one unit to another
 */
function convertValue(val, from, to, type) {
  if (from === to) return val;

  if (type === 'temperature') {
    // Step 1: to Celsius
    let c;
    if (from === 'Celsius')    c = val;
    else if (from === 'Fahrenheit') c = (val - 32) * 5 / 9;
    else                       c = val - 273.15; // Kelvin
    // Step 2: to target
    if (to === 'Celsius')    return c;
    if (to === 'Fahrenheit') return c * 9 / 5 + 32;
    return c + 273.15; // Kelvin
  }

  const base = val * TO_BASE[type][from];
  return base / TO_BASE[type][to];
}

/* ──────────────────────────────────────────
   App state
────────────────────────────────────────── */

let state = {
  type:   'length',
  action: 'comparison',
  op:     '+'
};

/* ──────────────────────────────────────────
   Type card selection
────────────────────────────────────────── */

document.querySelectorAll('.type-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
    state.type = card.dataset.type;
    renderCalculator();
  });
});

/* ──────────────────────────────────────────
   Action tab selection
────────────────────────────────────────── */

document.querySelectorAll('.action-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.action-tab-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.action = btn.dataset.action;
    renderCalculator();
  });
});

/* ──────────────────────────────────────────
   Build <option> list for a unit select
────────────────────────────────────────── */

function buildOptions(type, selected) {
  return UNITS[type]
    .map(u => `<option value="${u}"${u === selected ? ' selected' : ''}>${u}</option>`)
    .join('');
}

/* ──────────────────────────────────────────
   Render calculator based on current state
────────────────────────────────────────── */

const calcCard = document.getElementById('calc-card');

function renderCalculator() {
  const { type, action } = state;
  const units = UNITS[type];
  const u0 = units[0];
  const u1 = units[1] || units[0];

  calcCard.innerHTML = '';

  if (action === 'conversion')  renderConversion(type, u0, u1);
  if (action === 'comparison')  renderComparison(type, u0, u1);
  if (action === 'arithmetic')  renderArithmetic(type, u0, u1);
}

/* ── Conversion ── */
function renderConversion(type, u0, u1) {
  calcCard.innerHTML = `
    <div class="calc-row">
      <div>
        <p class="calc-field__label">From</p>
        <input class="calc-field__number" type="number" id="from-val" placeholder="0" />
        <select class="calc-field__select" id="from-unit">${buildOptions(type, u0)}</select>
      </div>

      <div class="calc-mid">
        <button class="btn-swap" id="btn-swap" title="Swap units">
          <svg viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
        </button>
      </div>

      <div>
        <p class="calc-field__label">To</p>
        <input class="calc-field__number" type="number" id="to-val" placeholder="0" />
        <select class="calc-field__select" id="to-unit">${buildOptions(type, u1)}</select>
      </div>
    </div>

    ${resultBoxHTML('Conversion Result', 'Enter a value to convert')}
  `;

  // Live conversion: from → to
  const fromVal  = document.getElementById('from-val');
  const toVal    = document.getElementById('to-val');
  const fromUnit = document.getElementById('from-unit');
  const toUnit   = document.getElementById('to-unit');

  function doConvert() {
    const v = parseFloat(fromVal.value);
    const res = document.getElementById('result-value');
    if (isNaN(v)) { setResultEmpty(res); return; }
    const converted = convertValue(v, fromUnit.value, toUnit.value, type);
    toVal.value = formatNum(converted);
    setResultValue(res, `${formatNum(v)} ${fromUnit.value} = ${formatNum(converted)} ${toUnit.value}`);
  }

  function doConvertReverse() {
    const v = parseFloat(toVal.value);
    const res = document.getElementById('result-value');
    if (isNaN(v)) { setResultEmpty(res); return; }
    const converted = convertValue(v, toUnit.value, fromUnit.value, type);
    fromVal.value = formatNum(converted);
    setResultValue(res, `${formatNum(converted)} ${fromUnit.value} = ${formatNum(v)} ${toUnit.value}`);
  }

  fromVal.addEventListener('input', doConvert);
  fromUnit.addEventListener('change', doConvert);
  toUnit.addEventListener('change', doConvert);
  toVal.addEventListener('input', doConvertReverse);

  document.getElementById('btn-swap').addEventListener('click', () => {
    const tmpUnit = fromUnit.value;
    const tmpVal  = fromVal.value;
    fromUnit.value = toUnit.value;
    toUnit.value   = tmpUnit;
    fromVal.value  = toVal.value;
    toVal.value    = tmpVal;
    doConvert();
  });
}

/* ── Comparison ── */
function renderComparison(type, u0, u1) {
  calcCard.innerHTML = `
    <div class="calc-row">
      <div>
        <p class="calc-field__label">Value A</p>
        <input class="calc-field__number" type="number" id="from-val" placeholder="1" value="1" />
        <select class="calc-field__select" id="from-unit">${buildOptions(type, u0)}</select>
      </div>

      <div class="calc-mid">
        <p class="vs-label">vs</p>
      </div>

      <div>
        <p class="calc-field__label">Value B</p>
        <input class="calc-field__number" type="number" id="to-val" placeholder="1000" value="1000" />
        <select class="calc-field__select" id="to-unit">${buildOptions(type, u1)}</select>
      </div>
    </div>

    <button class="btn-calculate" id="btn-compare">Compare</button>

    ${resultBoxHTML('Comparison Result', 'Press Compare to see result')}
  `;

  function doCompare() {
    const aVal = parseFloat(document.getElementById('from-val').value) || 0;
    const bVal = parseFloat(document.getElementById('to-val').value) || 0;
    const aUnit = document.getElementById('from-unit').value;
    const bUnit = document.getElementById('to-unit').value;

    // Convert B to A's unit for comparison
    const bInA = convertValue(bVal, bUnit, aUnit, type);

    let sym, colorClass;
    if (aVal < bInA)       { sym = '<'; colorClass = 'color:#1565c0'; }
    else if (aVal > bInA)  { sym = '>'; colorClass = 'color:#c62828'; }
    else                   { sym = '='; colorClass = 'color:#2e7d32'; }

    const res = document.getElementById('result-value');
    res.className = 'result-value';
    res.innerHTML = `<span style="${colorClass};font-size:19px;">${formatNum(aVal)} ${aUnit} &nbsp;${sym}&nbsp; ${formatNum(bVal)} ${bUnit}</span>`;
  }

  document.getElementById('btn-compare').addEventListener('click', doCompare);
  // Also run on Enter key in inputs
  ['from-val','to-val'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doCompare(); });
  });

  doCompare(); // auto-run with default values
}

/* ── Arithmetic ── */
function renderArithmetic(type, u0, u1) {
  calcCard.innerHTML = `
    <div class="arith-row">
      <div>
        <p class="calc-field__label">Value A</p>
        <input class="calc-field__number" type="number" id="a-val" placeholder="0" />
        <select class="calc-field__select" id="a-unit">${buildOptions(type, u0)}</select>
      </div>

      <div class="op-block">
        <p class="op-block__label">Operator</p>
        <div class="op-buttons">
          <button class="btn-op is-active" data-op="+">+</button>
          <button class="btn-op" data-op="-">−</button>
          <button class="btn-op" data-op="*">×</button>
          <button class="btn-op" data-op="/">÷</button>
        </div>
      </div>

      <div>
        <p class="calc-field__label">Value B</p>
        <input class="calc-field__number" type="number" id="b-val" placeholder="0" />
        <select class="calc-field__select" id="b-unit">${buildOptions(type, u1)}</select>
      </div>

      <div class="equals-sign">=</div>

      <div>
        <p class="calc-field__label">Result Unit</p>
        <input class="calc-field__number" id="res-display" placeholder="—" readonly
          style="background:var(--clr-bg);cursor:default;font-size:18px;" />
        <select class="calc-field__select" id="res-unit">${buildOptions(type, u0)}</select>
      </div>
    </div>

    <button class="btn-calculate" id="btn-calc">Calculate</button>

    ${resultBoxHTML('Arithmetic Result', 'Press Calculate to see result')}
  `;

  // Operator buttons
  document.querySelectorAll('.btn-op').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.op = btn.dataset.op;
    });
  });

  document.getElementById('btn-calc').addEventListener('click', () => {
    const aVal  = parseFloat(document.getElementById('a-val').value);
    const bVal  = parseFloat(document.getElementById('b-val').value);
    const aUnit = document.getElementById('a-unit').value;
    const bUnit = document.getElementById('b-unit').value;
    const rUnit = document.getElementById('res-unit').value;
    const res   = document.getElementById('result-value');

    if (isNaN(aVal) || isNaN(bVal)) {
      showToast('Please enter both values.', 'error');
      return;
    }

    // Convert both to result unit
    const aConverted = convertValue(aVal, aUnit, rUnit, type);
    const bConverted = convertValue(bVal, bUnit, rUnit, type);

    let result;
    switch (state.op) {
      case '+': result = aConverted + bConverted; break;
      case '-': result = aConverted - bConverted; break;
      case '*': result = aConverted * bConverted; break;
      case '/':
        if (bConverted === 0) { showToast('Cannot divide by zero.', 'error'); return; }
        result = aConverted / bConverted;
        break;
    }

    const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    document.getElementById('res-display').value = formatNum(result);
    setResultValue(
      res,
      `${formatNum(aVal)} ${aUnit}  ${opSymbols[state.op]}  ${formatNum(bVal)} ${bUnit}  =  ${formatNum(result)} ${rUnit}`
    );
  });
}

/* ──────────────────────────────────────────
   Result box helpers
────────────────────────────────────────── */

function resultBoxHTML(label, emptyMsg) {
  return `
    <div class="result-box" style="margin-top:24px;">
      <div class="result-icon">
        <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <div class="result-content">
        <p class="result-label">${label}</p>
        <p class="result-value is-empty" id="result-value">${emptyMsg}</p>
      </div>
    </div>
  `;
}

function setResultValue(el, text) {
  // Clone-replace to retrigger CSS animation on every update
  const fresh = el.cloneNode(false);
  fresh.textContent = text;
  fresh.className   = 'result-value';
  el.replaceWith(fresh);
}

function setResultEmpty(el) {
  const fresh = el.cloneNode(false);
  fresh.textContent = 'Enter a value to convert';
  fresh.className   = 'result-value is-empty';
  el.replaceWith(fresh);
}

/* ──────────────────────────────────────────
   Init
────────────────────────────────────────── */

renderCalculator();