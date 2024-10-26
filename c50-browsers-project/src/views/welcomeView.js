import { START_QUIZ_BUTTON_ID } from '../constants.js';

/**
 * Create the welcome screen
 * @returns {Element}
 */
export const createWelcomeElement = () => {
  const element = document.createElement('div');
  element.innerHTML = String.raw`
    <h1>Welcome to the JavaScript Quiz!</h1>
    <p>You have to answer 10 questions.</p>
    <p>Some questions have multiple answers.</p>
    <button id="${START_QUIZ_BUTTON_ID}">Start Quiz</button>
  `;
  return element;
};
