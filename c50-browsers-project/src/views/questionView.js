import { ANSWERS_LIST_ID } from '../constants.js';
import { NEXT_QUESTION_BUTTON_ID } from '../constants.js';
import { PREVIOUS_QUESTION_BUTTON_ID } from '../constants.js';
/**
 * Create a full question element
 * @returns {Element}
 */
export const createQuestionElement = (question) => {
  const element = document.createElement('div');

  element.innerHTML = String.raw`
    <h1>${question}</h1>

    <ul id="${ANSWERS_LIST_ID}"></ul>

    <button id="${PREVIOUS_QUESTION_BUTTON_ID}">
      Back
    </button>
    <button id="${NEXT_QUESTION_BUTTON_ID}">
      Next
    </button>
  `;

  return element;
};
