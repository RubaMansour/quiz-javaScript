import { quizData } from './data.js';
import { initWelcomePage } from './pages/welcomePage.js';
import { createTimerElement } from './timer.js';

const loadApp = () => {
  createTimerElement(); 
  initWelcomePage();
};

window.addEventListener('load', loadApp);
