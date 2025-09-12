// console.log("hello");
// console.log(global);

// const os = require("os");
// const path = require("path");

// console.log(os.type());
// console.log(os.version());
// console.log(os.homedir());
// // console.log(os.networkInterfaces());
// console.log(__dirname);
// console.log(__filename);

// console.log(path.dirname(__filename));
// console.log(path.basename(__filename));
// console.log(path.extname(__filename));

// console.log(path.parse(__filename));

// importing method from math filter:

const { add, divide, multiply, subtract } = require("./math");

console.log(add(2, 6));
console.log(subtract(2, 6));
console.log(multiply(2, 6));
console.log(divide(2, 6));
