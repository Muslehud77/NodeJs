const fs = require('fs')
console.log("I am number 1");
const output = fs.readFileSync(__dirname + '/hello.txt','utf8')

console.log(output);

const text = 'hello level2'

fs.writeFileSync(__dirname+"/write.txt",text);

console.log("I am number 2");