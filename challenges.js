/**
 * Challenge #1
 */
// function checkDogs(dogsJulia, dogsKate) {
//   const newDogsJulia = dogsJulia.slice(1, 3);
//   const data = newDogsJulia.concat(dogsKate);
//   data.forEach(function (age, dog) {
//     if (age < 3) {
//       console.log(`Dog number ${dog + 1} is still a puppy 🐶`);
//     } else {
//       console.log(`Dog number ${dog + 1} is an adult, and is ${age} years old`);
//     }
//   });
// }

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

/**
 * Challenge #2
 */
// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(function (age) {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   const adults = humanAge.filter(function (age) {
//     return age >= 18;
//   });
//   const avgHumanAge = adults.reduce(function (acc, curr) {
//     return acc + curr;
//   }, 0);

//   return avgHumanAge / adults.length;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

/**
 * Challenge #3
 */
// const calcAverageHumanAgev2 = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
// console.log(
//   calcAverageHumanAgev2([5, 2, 4, 1, 15, 8, 3]),
//   calcAverageHumanAgev2([16, 6, 10, 5, 6, 1, 4])
// );

/**
 * Challenge #4
 */

// Q1
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(curr => {
  curr.recommendedFood = Math.trunc(Number(curr.weight) ** 0.75 * 28);
});
console.log(dogs);

// Q2
/* Alternative Way
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  } `
);
*/
const sarahsDogConsumption = dogs
  .filter(curr => curr.owners.includes('Sarah'))
  .map(function (curr) {
    return curr.curFood > curr.recommendedFood
      ? 'Sarahs Dog is Eating Too Much'
      : 'Sarahs Dog is Eating Too Little';
  });
console.log(...sarahsDogConsumption);

// Q3
const fat = dogs
  .filter(curr => curr.curFood > curr.recommendedFood)
  .map(dog => dog.owners)
  .flat();
const skinny = dogs
  .filter(curr => curr.curFood < curr.recommendedFood)
  .map(dog => dog.owners)
  .flat();
console.log(fat, skinny);

// Q4
console.log(`${fat.join(' and ')}'s dogs eat too much!`);
console.log(`${skinny.join(' and ')}'s dogs eat too little!`);

// Q5
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// Q6
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

// Q7
const okayArr = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(okayArr);

// Q8
const copyArr = dogs.slice().sort((a, b) => {
  return a.recommendedFood - b.recommendedFood;
});
console.log(copyArr);
