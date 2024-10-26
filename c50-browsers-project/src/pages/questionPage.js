import {
  ANSWERS_LIST_ID,
  NEXT_QUESTION_BUTTON_ID,
  PREVIOUS_QUESTION_BUTTON_ID,
  USER_INTERFACE_ID,
} from '../constants.js';
import { createQuestionElement } from '../views/questionView.js';
import { createAnswerElement } from '../views/answerView.js';
import { quizData } from '../data.js';
import { startTimerFunction, stopTimer, getQuizDuration, resetTimer, hideTimer, showTimer} from '../timer.js';

let isReviewMode = false;
// Loads the app when the page is first opened
const loadApp = () => {
  quizData.currentQuestionIndex = 0; // Start from the first question
  quizData.selectedAnswers = new Array(quizData.questions.length).fill(null); // Initialize answers array
  quizData.score = 0;
  updateScoreDisplay(quizData.score);
  initQuestionPage(); // Initialize the first question
};

window.addEventListener('load', loadApp); // Set up loadApp to run when the page loads

// Initialize the question page
export const initQuestionPage = () => {
  isReviewMode = false;
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = ''; // Clear the interface before rendering the new question

  showTimer();

  // If there are no more questions, show the results page
  if (quizData.currentQuestionIndex >= quizData.questions.length) {
    showResultsPage();
    return;
  }
  updateScoreDisplay(quizData.score);
  const progressBarElement = createProgressBarElement();
  userInterface.appendChild(progressBarElement);
  updateProgressBar(quizData.currentQuestionIndex, quizData.questions.length);// Update progress
  const currentQuestion = quizData.questions[quizData.currentQuestionIndex]; // Get the current question

  const questionElement = createQuestionElement(currentQuestion.text); // Create the question element
  userInterface.appendChild(questionElement); // Append the question element to the page

  const answersListElement = document.getElementById(ANSWERS_LIST_ID);
  answersListElement.innerHTML = ''; // Clear previous answers

  const selectedAnswers = quizData.selectedAnswers[quizData.currentQuestionIndex] || []; // Get the selected answers for this question
  const answerState = quizData.answerStates && quizData.answerStates[quizData.currentQuestionIndex] || {}; // Get the state of answers

  // Loop through each answer option and render it
  for (const [key, answerText] of Object.entries(currentQuestion.answers)) {
    const answerElement = createAnswerElement(key, answerText, currentQuestion.multiple); // Create the answer element
    const input = answerElement.querySelector('input');

    // Pre-check answers that were already selected by the user
    if ((currentQuestion.multiple && selectedAnswers.includes(key)) || (!currentQuestion.multiple && selectedAnswers === key)) {
      input.checked = true;
    }

    // If the answer has been graded (correct/incorrect), color it accordingly
    if (answerState[key]) {
      if (answerState[key] === 'correct') {
        answerElement.style.backgroundColor = 'lightgreen'; // Correct answer
      } else if (answerState[key] === 'incorrect') {
        answerElement.style.backgroundColor = 'lightcoral'; // Incorrect answer
        input.disabled = true; // Disable the input if the answer was incorrect
      }
    }

    // Set up the event listener for answer selection
    answerElement.querySelector('input').addEventListener('change', () => selectAnswer(key, currentQuestion.multiple));
    answersListElement.appendChild(answerElement);
  }

  // Set up "Next" button to go to the next question
  document
    .getElementById(NEXT_QUESTION_BUTTON_ID)
    .addEventListener('click', nextQuestion);

  // Set up "Previous" button to go to the previous question
  const previousButton = document.getElementById(PREVIOUS_QUESTION_BUTTON_ID);
  if(!isReviewMode) {
    previousButton.style.display = 'none';
  } else if (previousButton) {
    previousButton.addEventListener('click', previousQuestion);

    // Hide the "Previous" button for the first question
    if (quizData.currentQuestionIndex === 0) {
      previousButton.style.display = 'none';
    } else {
      previousButton.style.display = 'inline-block';
    }
  }
};

// Go to the next question
const nextQuestion = () => {
  quizData.currentQuestionIndex += 1; // Move to the next question
  initQuestionPage(); // Re-initialize the question page
};

// Go to the previous question
const previousQuestion = () => {
  quizData.currentQuestionIndex -= 1; // Move to the previous question
  initQuestionPage(); // Re-initialize the question page
};

// Handle when a user selects an answer
const selectAnswer = (key, isMultiple) => {
  const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
  const answersListElement = document.getElementById(ANSWERS_LIST_ID);
  let answerState = quizData.answerStates || {}; // Initialize or get answer states

  if (!answerState[quizData.currentQuestionIndex]) {
    answerState[quizData.currentQuestionIndex] = {}; // Initialize answer state for the current question
  }

  if (isMultiple) {
    const selectedAnswers = quizData.selectedAnswers[quizData.currentQuestionIndex] || [];

    if (selectedAnswers.includes(key)) {
      quizData.selectedAnswers[quizData.currentQuestionIndex] = selectedAnswers.filter(answer => answer !== key);
    } else {
      quizData.selectedAnswers[quizData.currentQuestionIndex] = [...selectedAnswers, key];
    }

    if (currentQuestion.correct.includes(key)) {
      document.querySelector(`input[value="${key}"]`).parentNode.parentNode.classList.add('correct');
      answerState[quizData.currentQuestionIndex][key] = 'correct'; 
    } else {
      document.querySelector(`input[value="${key}"]`).parentNode.parentNode.classList.add('wrong');
      answerState[quizData.currentQuestionIndex][key] = 'incorrect'; 

      Array.from(answersListElement.querySelectorAll('input')).forEach(input => {
        input.disabled = true;
      });
    }
  } else {
    quizData.selectedAnswers[quizData.currentQuestionIndex] = key;

    Array.from(answersListElement.querySelectorAll('input')).forEach(input => {
      input.disabled = true;
    });

    for (const [answerKey] of Object.entries(currentQuestion.answers)) {
      const answerElement = document.querySelector(`input[value="${answerKey}"]`).parentNode.parentNode;

      if (answerKey === currentQuestion.correct) {
        answerElement.classList.add('correct');
        answerState[quizData.currentQuestionIndex][answerKey] = 'correct'; 
      } else if (answerKey === key) {
        answerElement.classList.add('wrong');
        answerState[quizData.currentQuestionIndex][answerKey] = 'incorrect'; 
      }
    }
  }

  quizData.answerStates = answerState; 
  localStorage.setItem('quizData', JSON.stringify(quizData));
};
// Show the results page
const showResultsPage = () => {
  stopTimer(); // Stop the quiz timer
  const quizDuration = getQuizDuration(); // Get the quiz duration
  const formattedTime = formatTime(quizDuration);
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = ''; // Clear the interface

  const totalQuestions = quizData.questions.length;
  let userScore = 0;

  // Calculate the user's score
  quizData.questions.forEach((question, index) => {
    const userAnswer = quizData.selectedAnswers ? quizData.selectedAnswers[index] : null;

    if (userAnswer !== null && userAnswer.length > 0) {
      if (question.multiple) {
        const correctAnswers = question.correct.split(',').map(answer => answer.trim()).sort();
        const selectedAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [];

        if (JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers)) {
          userScore += 1;
        }
      } else {
        if (userAnswer === question.correct) {
          userScore += 1;
        }
      }
    }
  });

  // Display the results and options to start over or review answers
  const resultElement = document.createElement('div');
  resultElement.innerHTML = String.raw`
    <h1>Congratulations!</h1>
    <p>You scored ${userScore} out of ${totalQuestions}!</p>
    <p>You completed the quiz in ${formattedTime} minutes.</p>
    <button id="check-answers-button">Check Your Answers</button>
    <button id="start-over-button">Start Over</button>
  `;

  userInterface.appendChild(resultElement);

  hideTimer();

  // Set up the button to restart the quiz
  document
    .getElementById('start-over-button')
    .addEventListener('click', resetQuiz);

  // Set up the button to review answers
  document
    .getElementById('check-answers-button')
    .addEventListener('click', reviewAnswers);
};

// Reset the quiz and clear all saved data
const resetQuiz = () => {
  localStorage.removeItem('quizData'); // Clear local storage

  quizData.currentQuestionIndex = 0; // Reset the question index
  quizData.selectedAnswers = new Array(quizData.questions.length).fill(null); // Clear selected answers
  quizData.answerStates = {}; // Clear answer states

  resetTimer(); // Reset the quiz timer

  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = `Time: 0:00`;
  }

  // Start the timer again for a new quiz
  startTimerFunction((elapsedTime) => {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  });

  initQuestionPage(); // Restart the quiz from the first question
};

// Review the user's answers
const reviewAnswers = () => {
  isReviewMode = true;
  quizData.currentQuestionIndex = 0; // Start from the first question
  showReviewPage(); // Show the review page
};

// Show the review page for a single question
const showReviewPage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = ''; // Clear the interface

  const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
  const storedQuizData = JSON.parse(localStorage.getItem('quizData')) || {}; // Get saved quiz data

  const selectedAnswers = storedQuizData.selectedAnswers && storedQuizData.selectedAnswers[quizData.currentQuestionIndex]
    ? storedQuizData.selectedAnswers[quizData.currentQuestionIndex]
    : null;

  const questionElement = createQuestionElement(currentQuestion.text);
  userInterface.appendChild(questionElement);

  const answersListElement = document.getElementById(ANSWERS_LIST_ID);
  answersListElement.innerHTML = ''; // Clear previous answers

  // Loop through and display all answers with correct/incorrect feedback
  for (const [key, answerText] of Object.entries(currentQuestion.answers)) {
    const answerElement = createAnswerElement(key, answerText, currentQuestion.multiple);
    const input = answerElement.querySelector('input');

    if (selectedAnswers && ((currentQuestion.multiple && selectedAnswers.includes(key)) || 
        (!currentQuestion.multiple && selectedAnswers === key))) {
      input.checked = true;

      if (currentQuestion.correct.includes(key)) {
        answerElement.style.backgroundColor = 'lightgreen'; // Correct answer
      } else {
        answerElement.style.backgroundColor = 'lightcoral'; // Incorrect answer
      }
    }

    input.disabled = true; // Disable inputs in review mode

    answersListElement.appendChild(answerElement);
  }

  // Set up "Next" button for review navigation
  document
    .getElementById(NEXT_QUESTION_BUTTON_ID)
    .addEventListener('click', nextReviewQuestion);

  // Set up "Previous" button for review navigation
  const previousButton = document.getElementById(PREVIOUS_QUESTION_BUTTON_ID);
  if (previousButton) {
    previousButton.addEventListener('click', previousReviewQuestion);

    if (quizData.currentQuestionIndex === 0) {
      previousButton.style.display = 'none';
    } else {
      previousButton.style.display = 'inline-block';
    }
  }
};

// Go to the next question in review mode
const nextReviewQuestion = () => {
  quizData.currentQuestionIndex += 1;
  if (quizData.currentQuestionIndex < quizData.questions.length) {
    showReviewPage(); // Show the next question
  } else {
    showResultsPage(); // If no more questions, return to the results page
  }
};

// Go to the previous question in review mode
const previousReviewQuestion = () => {
  quizData.currentQuestionIndex -= 1;
  if (quizData.currentQuestionIndex >= 0) {
    showReviewPage(); // Show the previous question
  }
};

//create progress-bar
const createProgressBarElement = () => {
  const progressContainer = document.createElement('div'); 
  progressContainer.id = 'progress-container'; 
  const progressBar = document.createElement('progress');
  progressBar.id = 'progress-bar';
  progressBar.value = 0; 
  progressBar.max = 100;  
  progressContainer.appendChild(progressBar);

  return progressContainer;  
}


const updateProgressBar = (currentQuestionIndex, totalQuestions) => {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    const progressPercentage = (currentQuestionIndex / totalQuestions) * 100; 
    progressBar.value = progressPercentage; 
  }
};

const updateScoreDisplay = () => {
  const scoreElement = document.getElementById('score-display'); // Get the score display element
  let userScore = 0; // Initialize the variable to store the total score

  // Calculate the score based on the answers
  quizData.questions.forEach((question, index) => {
    const userAnswer = quizData.selectedAnswers ? quizData.selectedAnswers[index] : null; // Get the user's answer for the current question

    if (userAnswer !== null && userAnswer.length > 0) { // Check if the user has selected an answer
      if (question.multiple) { // Check if the question allows multiple answers
        const correctAnswers = question.correct.split(',').map(answer => answer.trim()).sort(); // Get and format the correct answers
        const selectedAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : []; // Sort the selected answers

        // Check if all correct answers have been selected
        const allCorrectSelected = correctAnswers.every(answer => selectedAnswers.includes(answer));
        // Check if there are any incorrect answers selected
        const anyIncorrectSelected = selectedAnswers.some(answer => !correctAnswers.includes(answer));

        // If all correct answers are selected and there are no incorrect answers, add one point
        if (allCorrectSelected && !anyIncorrectSelected) {
          userScore += 1; // Add one point for the correct answers
        }
      } else {
        // For single answer questions
        if (userAnswer === question.correct) { // Check if the selected answer is correct
          userScore += 1; // Add one point for the correct answer
        }
      }
    }
  });

  // Update the score display
  if (scoreElement) {
    scoreElement.textContent = `Score: ${userScore}`; // Update the text with the current score
  } else {
    // If the score display doesn't exist, create it
    const newScoreElement = document.createElement('div'); // Create a new div for the score
    newScoreElement.id = 'score-display'; // Set the id for the score display
    newScoreElement.textContent = `Score: ${userScore}`; // Set the initial text for the score
    document.getElementById(USER_INTERFACE_ID).prepend(newScoreElement); // Prepend it to the user interface
  }
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};
