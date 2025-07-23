import 'katex/dist/katex.min.css';
import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';

//  Strip known delimiters from LaTeX string
function parseLatexWithDelimiters(raw) {
  if (!raw || typeof raw !== 'string') return { cleanLatex: '', displayMode: false };

  let latex = raw.trim();

  // Unescape double backslashes, e.g. "\\(" => "\("
  latex = latex.replace(/\\\\/g, '\\');

  let displayMode = false;

  // To detect delimiters with optional surrounding whitespace
  const displayDelimiters = [
    { left: /^\s*\$\$\s*/, right: /\s*\$\$\s*$/ },
    { left: /^\s*\\\[\s*/, right: /\s*\\\]\s*$/ }
  ];
  const inlineDelimiters = [
    { left: /^\s*\$\s*/, right: /\s*\$\s*$/ },
    { left: /^\s*\\\(\s*/, right: /\s*\\\)\s*$/ }
  ];

  // Remove display delimiters
  for (const delim of displayDelimiters) {
    if (delim.left.test(latex) && delim.right.test(latex)) {
      latex = latex.replace(delim.left, '').replace(delim.right, '').trim();
      displayMode = true;
      break;
    }
  }

  // Remove inline delimiters if display not set yet
  if (!displayMode) {
    for (const delim of inlineDelimiters) {
      if (delim.left.test(latex) && delim.right.test(latex)) {
        latex = latex.replace(delim.left, '').replace(delim.right, '').trim();
        break;
      }
    }
  }

  return { cleanLatex: latex, displayMode };
}

// Renders KaTeX in static content like problem body or comments
function renderMath(container) {
  if (!container) return;

  // First, render any custom <span data-w-e-type="formula"> (used by WangEditor)
  container.querySelectorAll('span[data-w-e-type="formula"]').forEach(span => {
    const raw = span.dataset.value;
    if (!raw) return;

    const { cleanLatex, displayMode } = parseLatexWithDelimiters(raw);

    try {
      katex.render(cleanLatex, span, {
        throwOnError: false,
        displayMode,
        errorColor: '#cc0000'
      });
    } catch (err) {
      console.error('KaTeX render error:', err.message);
      span.textContent = `[Math Error: ${cleanLatex}]`;
      span.style.color = 'red';
    }
  });

  // Then use KaTeX auto-render for inline/display math with delimiters
  renderMathInElement(container, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false },
    ],
    throwOnError: false,
    errorColor: '#cc0000',
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'span'],
  });
}

window.renderMathInElement = renderMath;

document.addEventListener('DOMContentLoaded', () => {
  renderMath(document.getElementById('problem-content-segment'));
  renderMath(document.querySelector('.ui.comments'));
});