import 'katex/dist/katex.min.css';
import { renderMath } from './utils/math_helpers';

document.addEventListener('DOMContentLoaded', () => {
  renderMath(document.getElementById('problem-content-segment'));
  renderMath(document.querySelector('.ui.comments'));
});