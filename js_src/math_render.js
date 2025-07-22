import 'katex/dist/katex.min.css';
import katex from 'katex';

/**
 * Finds all wangeditor formula spans within a given container element and renders them using KaTeX.
 * @param {HTMLElement} container The parent element to search within.
 */
function renderMathInElement(container) {
  // If the container doesn't exist, do nothing.
  if (!container) return;

  const formulaElements = container.querySelectorAll('span[data-w-e-type="formula"]');

  formulaElements.forEach(span => {
    // Get the LaTeX string from the 'data-value' attribute.
    const latex = span.dataset.value;
    if (latex) {
      try {
        // Render the formula using KaTeX.
        // This will replace the content of the span with the beautifully rendered math.
        katex.render(latex, span, {
          throwOnError: false, // Don't stop the whole script if one formula has a typo.
          displayMode: false   // wangeditor formulas are always inline spans.
        });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        // If there's an error, display a helpful message instead of crashing.
        span.textContent = `[Math Error: ${latex}]`;
        span.style.color = 'red';
      }
    }
  });
}

// Make this function globally available so other scripts (like comment.js) can call it.
window.renderMathInElement = renderMathInElement;

// When the page first loads, run the renderer on the main content areas.
document.addEventListener('DOMContentLoaded', () => {
  console.log('Rendering initial math content...');
  renderMathInElement(document.getElementById('problem-content-segment'));
  renderMathInElement(document.querySelector('.ui.comments'));
});