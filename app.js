// Interactividad del sitio estático del OVA (sin dependencias externas)

function checkAnswer(btn) {
  const wrap = btn.closest('.kc-answers');
  const feedback = wrap.querySelector('.kc-feedback');
  wrap.querySelectorAll('.kc-answer').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
  feedback.textContent = btn.dataset.feedback || '';
}

// --- Matching ---
let _matchState = null;
function registerMatching(mapping) {
  // mapping: { term: definition }
  const kcEls = document.querySelectorAll('.kc[data-qtype="match"]');
  const kc = kcEls[kcEls.length - 1]; // el último registrado corresponde a este script
  kc._mapping = mapping;
}
let _selectedTerm = null;
function selectMatch(btn) {
  if (btn.classList.contains('matched')) return;
  document.querySelectorAll('.match-term').forEach(b => { if (!b.classList.contains('matched')) b.classList.remove('selected'); });
  btn.classList.add('selected');
  _selectedTerm = btn;
}
function selectMatchDef(btn) {
  if (btn.classList.contains('matched') || !_selectedTerm) return;
  const kc = btn.closest('.kc');
  const mapping = kc._mapping || {};
  const term = _selectedTerm.textContent.trim();
  const def = btn.textContent.trim();
  const feedback = kc.querySelector('.kc-feedback');
  if (mapping[term] === def) {
    _selectedTerm.classList.add('matched');
    _selectedTerm.classList.remove('selected');
    btn.classList.add('matched');
    feedback.style.color = '#065F46';
    feedback.textContent = 'Correcto: ' + term + ' ↔ ' + def;
    _selectedTerm = null;
    const terms = kc.querySelectorAll('.match-term');
    const allMatched = Array.from(terms).every(t => t.classList.contains('matched'));
    if (allMatched) feedback.textContent = '¡Completado! Todas las parejas son correctas.';
  } else {
    feedback.style.color = '#991B1B';
    feedback.textContent = 'Esa combinación no es correcta, intenta de nuevo.';
    btn.classList.add('selected');
    setTimeout(() => btn.classList.remove('selected'), 500);
  }
}
