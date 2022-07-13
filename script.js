'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Smith',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'William Djong',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/**
 * Creating DOM Elements
 * template literals are amazing for creating html templates
 * To add elements, use Element.insertAdjacentHTML(position you want to attach the element, the element you want to add)
 * Look up MDN for more info regarding the first argument
 * Element.innerHTML is a lil bit similar to Element.textContent
 *    The difference the latter only returns text, the former returns everything including all the HTML tags
 */

function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${mov}€</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur, i, arr) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calcDisplayBalance(account1.movements);

function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(expenses)}€`;

  const interests = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * acc.interestRate) / 100;
    })
    .filter(function (int, i) {
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `${interests}€`;
}
// calcDisplaySummary(account1.movements);

const createUsernames = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        // retrieving only the first letter
        return name[0];
      })
      .join('');
  });
};

createUsernames(accounts);

/**
 * Implementing Login
 * In HTML, the default behaviour when we click the submit button that is from a form is for the page to reload
 * You can use .preventDefault() to prevent this
 * Hitting enter on the other fields in the form is the same as clicking the submit button
 *  Both will trigger a click event
 * Use blur to remove focus on html elements
 */

const clearInputFields = function (fieldOne, fieldTwo) {
  fieldOne.value = fieldTwo.value = '';
  fieldTwo.blur();
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // Using optional chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    clearInputFields(inputLoginUsername, inputLoginPin);
    clearInputFields(inputTransferAmount, inputTransferTo);

    // Update UI
    updateUI(currentAccount);
  }
});

/**
 * Implementing Transfers
 */

function transferMoney(senderObject, receiverObject, amount) {
  senderObject.movements.push(-amount);
  receiverObject.movements.push(amount);
}

function updateUI(acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
}

function hideUI() {
  containerApp.style.opacity = 0;
}

// event handler
btnTransfer.addEventListener('click', function (e) {
  // prevent reloading
  e.preventDefault();
  // get amount
  const amount = Number(inputTransferAmount.value);
  // get receiver account
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // check receiver exists, amount > 0, sender has enough money, receiver and sender are a different person
  if (
    receiverAccount &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount.owner !== currentAccount.owner
  ) {
    console.log('Hello');
    // Do the transfer (make function)
    transferMoney(currentAccount, receiverAccount, amount);
    // Update UI (make function)
    updateUI(currentAccount);
  }
  // Clear input fields
  clearInputFields(inputTransferAmount, inputTransferTo);
});

/**
 * Implementing Loan
 */
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

/**
 * Implementing Close account
 */
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.find(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    hideUI();
  }
  clearInputFields(inputCloseUsername, inputClosePin);
});

/**
 * Implementing sort functionality
 */
let sortState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortState);
  sortState = !sortState;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/**
 * Simple Array Methods
 * Method are functions attached to objects
 * If we have array methods, that means that arrays are also objects
 * Thus they get access to special built in methods that we can essentially see as tools for arrays
 * Go to the mdn documentation to learn more about the array methods you will be using in your projects
 * Some methods mutate the array and some does not
 */

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE (same as the one for strings) - extract part of an array without changing the original array
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice()); // -> will give a shallow copy of the array

// SPLICE - works the same way as slice only it changes the original array and the second parameter is different
// usually used to delete elements from an array
// first parameter is index
// second parameter is deleteCount
console.log(arr.splice(-1));
console.log(arr);
console.log(arr.splice(1, 2)); // -> goes to position 1 and delete all elements
console.log(arr);

// REVERSE - reverses and mutates the original array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr.reverse());
console.log(arr);

// CONCAT - concatenates/merges two arrays
// firstArr.concat(secondArr)
// doesnt mutate the original array
const concatResult = arr.concat(arr2);
console.log(concatResult);
console.log([...arr, ...arr2]); // -> spread equivalent

// JOIN - same as string method
console.log(concatResult.join('-'));

/**
 * The 'at' method
 * Shows which index the array is at
 * Same as array bracket notation
 * Works for both strings and numbers
 */
const arr3 = [23, 11, 64];
console.log(arr3[0]);
console.log(arr3.at(0));
// Getting the last element
console.log(arr3[arr3.length - 1]);
console.log(arr3.slice(-1)[0]);
console.log(arr3.at(-1));
console.log('william'.at(0));
console.log('william'.at(-1));

/**
 * Looping Arrays: forEach
 * fopEach is a higher order function which requires a call back function in order to tell it what to do
 * forEach will loop over the array and for each iteration, it will call the callback function and pass in
 * the current element of the array as an argument of the callback function
 * forEach passes in not only the current element but also the index and the entire array that is being looped
 * forEach(function(currentElement, index, array))
 * break and continue does not work on the forEach loop
 * forEach will loop and you can't disrupt midway
 */

let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
movements.forEach(function (movement) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
});
movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

/**
 * forEach with Maps and Sets
 */
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

/**
 * Data Transformations: map, filter, reduce
 * map
 *  To loop over arrays
 *  Similar to forEach method but creates a new array based on the original array
 *  Takes an array, loops over that array and in each iteration it applies a call back function that we
 *    specify in our code to the current array element
 *  Basically it maps the value of the original array to a new array
 * filter
 *  It's use to filter elements in the original array which satisfy a certain condition
 *  Elements for which the condition is true will be included in a new array that a filter method returns
 * reduce
 *  Boils all array elements down to one single value
 *    For example: adding all elements together
 *  The reduce method has a accumulator variable
 *
 * Both map and filter returns a new Array whereas Reduce returns the final reduced value
 */

/**
 * The map method
 * map method also has access to the same three parameters as forEach
 *  (currentElement, currentIndex, the whole array)
 * Unlike forEach, map method returns instead printing
 */

movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

let eurToUsd = 1.1;

const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
});

console.log(movements);
console.log(movementsUSD);

/**
 * The filter method
 * filter method also has access to the same three parameters as forEach
 *  (currentElement, currentIndex, the whole array)
 * returns a boolean value
 */

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

/**
 * The reduce method
 * It's the most powerful array method in Javascript
 * We use the reduce method to essentially boil down all the elements in an array to one single value
 * reduce method call back arguments
 *  (accumulator, currentElement, currentIndex, the whole array)
 * reduce method arguments
 *  (callback function, initial value of the accumulator)
 * In the reduce method, we always have to somehow return the accumulator to the next iteration
 */

const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);

console.log(balance);

// Maximum Value
const max = movements.reduce(function (acc, mov) {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);

console.log(max);

/**
 * The Magic of Chaining Methods
 * We can only chain a method if the previous method returns an array
 * You can look at it like a pipeline that processes data
 * DO NOT OVERUSE CHAINING
 *  chaining can cause performance issues if you are using large arrays
 *  try compress the method chaining to as little methods as possible
 * It is bad practice to chain methods that mutates the underlying the original array
 *  for example: splice() & reverse()
 */
eurToUsd = 1.1;
// PIPELINE
const totalDepositsUSD = movements
  .filter(function (mov) {
    return mov > 0;
  })
  .map(function (mov) {
    return mov * eurToUsd;
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
console.log(totalDepositsUSD);

/**
 * The find Method
 * Retrieve one element in an array based on a condition
 * Also takes in a callback function that returns a boolean
 * Does not return an array
 * It will return only the first element in the array that satisfies the condition
 * Usually the goal of the find method is to find exactly one element
 * Will return undefined if no element matches the specified condition
 */
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

/**
 * The findIndex Method
 * returns the index of the found element instead of the element itself
 * Used above for implementing the close account functionality
 * Also gets access to the current index and the entire array
 */

/**
 * some and every
 * The some method is similar to the includes method, however the some method allow you to specify a condition
 * The every method only returns true if all elements in the array satisfies the condition passed in
 *  i.e. if every element passes the test in our callback function only then it returns true
 */
// SOME
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);
// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

/**
 * flat and flatMap
 * flat removes the nested arrays and flattens the array
 *  you can optionally specify an argument number which tells the method how deep you want the array to be flattened
 * Using a map then flatenning the array is a common operation
 *  Thus JS introduced flatMap
 *    flatMap only goes one level deep tho
 */
const arrTemp = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arrTemp.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat());
console.log(arrDeep.flat(2));

// flat
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// flatMap
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

/**
 * Sorting Arrays
 * .sort() mutates the original array so be careful when using it
 *    It does sorting based on strings
 *      Converts the elements into strings then it sorts them thus this method does not work on numbers
 * To use it for numbers, you will need a callback function
 *  the function will have two arguments:
 *    the first one is the current element & the second one is the next element
 *      To sort in ascending order
 *        return > 0
 *      To sort in descending order
 *        return < 1
 * If you are sorting an array that contains numbers and string, DO NOT USE the sort method
 */

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
// return > 0, A, B (keep order)
// return < 0, B, A (switch order)

// Ascending
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(movements);
// shorter version
movements.sort((a, b) => a - b);

// Descending
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);
// shorter version
movements.sort((a, b) => b - a);
console.log(movements);

/**
 * More Ways of Creating and Filling arrays
 * Weird behaviour of Array function:
 *  Whenever you only pass in one argument, it will create a new empty array with that length
 * fill(specificValue, optional start-inclusive, optional end-exclusive) will fill the entire array with the specificValue
 *  fill() will mutate the original array
 * All iterables in JS can be converted to an array through Array.from()
 *  Array.from() are perfect for querySelectorAll because querySelectorAll is unable to use the traditional array methods
 *    Array.from() gives them this opportunity
 * Array.from(arrayLike, optional map callback function)
 */
const test = new Array(1, 2, 3, 4, 5, 6, 7);
console.log(test);

// Empty arrays + fill methods
const x = new Array(7);
console.log(x);
x.fill(1, 3, 5);
console.log(x);
x.fill(1);
console.log(x);

test.fill(23, 2, 6);
console.log(test);

// Array.from()
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
const z = Array.from({ length: 7 }, (curr, i) => i + 1);
console.log(z);

/**
 * Summary: Which Array Method to Use?
 * See lecture slide
 */
/////////////////////////////////////////////////

/**
 * Practice Exercises
 */
// 1
const bankDepositSum = accounts
  .map(acc => acc.movements) // -> flatMap could be used instead
  .flat()
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum);

// 2
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000)
  .reduce(acc => acc + 1, 0);
console.log(numDeposits1000);

// 3
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (acc, mov) => {
      mov > 0 ? (acc.deposits += mov) : (acc.withdrawals += mov);
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

// 4
// this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'on', 'in', 'with'];
  const words = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(words);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
