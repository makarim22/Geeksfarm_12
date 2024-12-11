// Declaring and initializing arrays

// Number Array
let arr = [10, 20, 30, 40, 50];
let arr1 = [110, 120, 130, 140];

// String array
let string_arr = ["Alex", "peter", "chloe"];

// push: Adding elements at the end of the array
arr.push(60);
console.log("After push op " + arr);

// unshift() Adding elements at the start of the array
arr.unshift(0, 10);
console.log("After unshift op " + arr );

// pop: removing elements from the end of the array
arr.pop();
console.log("After pop op" + arr);

// shift(): Removing elements from the start of the array
arr.shift();
console.log("After shift op " + arr);

// splice(x,y): removes x number of elements
// starting from index y
arr.splice(2, 1);
console.log("After splice op" + arr);

// reverse(): reverses the order of elements in array
arr.reverse();
console.log("After reverse op" + arr);

// concat(): merges two or more array
console.log("After concat op" + arr.concat(arr1));