/**
 * Create an Answer element
 * @param {string} key - key of an answer like 'a', 'b', 'c'
 * @param {string} answerText - text of an answer
 * @param {boolean} isMultiple - flag for multiple choice
 * @returns {Element}
 */
export const createAnswerElement = (key, answerText, isMultiple) => {
  const element = document.createElement('div'); // Create a div for the answer item
  element.classList.add('answer-item'); // Add a custom class for styling

  const inputType = isMultiple ? 'checkbox' : 'radio'; // Determine input type (checkbox for multiple, radio for single)

  // Add input and label elements with the correct design
  element.innerHTML = String.raw`
    <label class="answer-label">
      <input type="${inputType}" name="answer" value="${key}" class="custom-input"/> 
      <span class="custom-input-design"></span> 
      ${key}: ${answerText}
    </label>
  `;

  const input = element.querySelector('input'); // Get the input element

  // Make the entire answer area clickable
  element.addEventListener('click', () => {
    if (input.disabled) return; // If the input is disabled after a wrong answer, do nothing

    if (isMultiple) {
      input.checked = !input.checked; // Toggle checkbox selection for multiple answers
    } else {
      input.checked = true; // Select the current radio button for single choice
    }

    input.dispatchEvent(new Event('change')); // Trigger change event for further handling
  });

  return element; // Return the created answer element
};
