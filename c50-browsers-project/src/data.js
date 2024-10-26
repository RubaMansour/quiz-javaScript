/* Program Data

  in this file you can declare variables to store important data for your program
  the data can only be primitives, objects or arrays
  do not store dom elements in these variables!!!!

  these variables will be imported by your handlers when necessary
    not by your logic
    not by your listeners
*/

export const quizData = {
  currentQuestionIndex: 0,
  questions: [
    {
      text:
        'What is the correct way to define an arrow function in JavaScript?',
      answers: {
        a: 'let func = () => {}',
        b: 'let func = function() => {}',
        c: 'let func = => {}',
        d: 'let func() => {}',
      },
      correct: 'a',
      selected: null,
      multiple: false,
      links: [
        {
          text: 'MDN - Arrow functions',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
        },
        {
          text: 'javascript.info',
          href: 'https://javascript.info/arrow-functions-basics',
        },
      ],
    },
    {
      text: 'What is the difference between `==` and `===` in JavaScript?',
      answers: {
        a: '`==` compares only values, `===` compares values and types',
        b: '`==` compares values and types, `===` compares only values',
        c: '`==` performs type coercion, `===` does not',
        d: 'Both compare only values without checking type',
      },
      correct: 'a',
      selected: null,
      multiple: false,
      links: [
        {
          text: 'MDN - Equality comparisons',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness',
        },
        {
          text: 'javascript.info',
          href: 'https://javascript.info/comparison',
        },
      ],
    },
    {
      text:
        'Which of the following is NOT a primitive data type in JavaScript?',
      answers: {
        a: 'Object',
        b: 'String',
        c: 'Boolean',
        d: 'Number',
      },
      correct: 'a',
      selected: null,
      multiple: false,
      links: [
        {
          text: 'MDN - Data types',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values',
        },
        {
          text: 'javascript.info',
          href: 'https://javascript.info/types',
        },
      ],
    },
    {
      text: 'How do you create a promise in JavaScript?',
      answers: {
        a: 'let promise = new Promise(resolve, reject)',
        b: 'let promise = new Promise((resolve, reject) => {})',
        c: 'let promise = Promise.resolve()',
        d: 'let promise = new Promise()',
      },
      correct: 'b',
      selected: null,
      multiple: false,
      links: [
        {
          text: 'MDN - Promises',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        },
        {
          text: 'javascript.info',
          href: 'https://javascript.info/promise-basics',
        },
      ],
    },
    {
      text: 'What is the purpose of the `map` method in JavaScript arrays?',
      answers: {
        a: 'It modifies the array by applying a function to each element',
        b: 'It creates a new array by applying a function to each element',
        c: 'It filters the elements of an array',
        d: 'It sorts the array based on the function applied',
      },
      correct: 'b',
      selected: null,
      multiple: false,
      links: [
        {
          text: 'MDN - Array.prototype.map()',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
        },
        {
          text: 'javascript.info',
          href: 'https://javascript.info/array-methods#map',
        },
      ],
    },
    {
      text: 'Which of the following will NOT trigger a `TypeError`?',
      answers: {
        a: 'Accessing a property of `undefined`',
        b: 'Calling a method on `null`',
        c: 'Trying to reassign a constant',
        d: 'Comparing `null` with a number',
      },
      correct: 'd',
      selected: null,
      multiple: false,
      links: [
        {
          text: 'MDN - TypeError',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError',
        },
      ],
    },
    {
      text: 'What does the `async` keyword do in JavaScript?',
      answers: {
        a: 'It defines a function that returns a Promise',
        b: 'It makes a function run asynchronously',
        c: 'It pauses the execution of a function',
        d: 'It blocks execution until the promise resolves',
      },
      correct: 'a',
      selected: null,
      multiple: false,
      links: [
        {
          text: 'MDN - async function',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
        },
        {
          text: 'javascript.info',
          href: 'https://javascript.info/async-await',
        },
      ],
    },
    {
      text:
        'Which of the following methods can be used to stop the propagation of an event in JavaScript?',
      answers: {
        a: 'event.preventDefault()',
        b: 'event.stopPropagation()',
        c: 'event.stopImmediatePropagation()',
        d: 'event.cancelBubble = true',
      },
      correct: 'b,c,d',
      selected: null,
      multiple: true,
      links: [
        {
          text: 'MDN - Event propagation',
          href:
            'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_propagation',
        },
      ],
    },
    {
      text: 'How can you clone an object in JavaScript?',
      answers: {
        a: 'Object.clone(obj)',
        b: 'Object.assign({}, obj)',
        c: 'Object.create(obj)',
        d: 'JSON.parse(JSON.stringify(obj))',
      },
      correct: 'b,d',
      selected: null,
      multiple: true,
      links: [
        {
          text: 'MDN - Object.assign()',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign',
        },
        {
          text: 'javascript.info',
          href: 'https://javascript.info/object-copy',
        },
      ],
    },
    {
      text:
        'Which of the following is a correct way to handle an error in a Promise chain?',
      answers: {
        a: 'promise.catch(err => console.log(err))',
        b: 'promise.finally(() => handleError())',
        c:
          'promise.then(result => handle(result)).catch(err => console.log(err))',
        d: 'promise.throw(err => handleError())',
      },
      correct: 'a,c',
      selected: null,
      multiple: true,
      links: [
        {
          text: 'MDN - Promises',
          href:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        },
      ],
    },
  ],
};
