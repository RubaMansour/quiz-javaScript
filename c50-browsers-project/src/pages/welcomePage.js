import { USER_INTERFACE_ID, START_QUIZ_BUTTON_ID } from '../constants.js';
import { createWelcomeElement } from '../views/welcomeView.js';
import { initQuestionPage } from './questionPage.js';
import { startTimerFunction } from '../timer.js';

export const initWelcomePage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

  // Create and style logo element
  const logoElement = document.createElement('img');
  logoElement.src = 'https://irdeto-wp-content.irdeto.com/wp-content/uploads/2022/11/01113520/Hack-Your-Future.png'; 
  logoElement.alt = 'HackYourFuture Logo';
  logoElement.classList.add('logo');
  userInterface.appendChild(logoElement);

  // Create welcome box container
  const welcomeBox = document.createElement('div');
  welcomeBox.classList.add('welcome-box');

  // Append welcome element (text content)
  const welcomeElement = createWelcomeElement();
  welcomeBox.appendChild(welcomeElement);

  // Append the welcome box to the user interface
  userInterface.appendChild(welcomeBox);

  // Set up event listener for the start quiz button
  document
    .getElementById(START_QUIZ_BUTTON_ID)
    .addEventListener('click', startQuiz);
};

// Timer display function
const updateTimerDisplay = (elapsedTime) => {
  const timerElement = document.getElementById('timer');
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Start quiz function
const startQuiz = () => {
  startTimerFunction(updateTimerDisplay);
  initQuestionPage();
};
