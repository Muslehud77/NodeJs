const fs = require('fs')

console.log('I am number 1');

fs.readFile(__dirname + '/hello.txt','utf8',(err,data)=>{
    if(err){
        throw new Error("Error reading file")
    }
    console.log(data);
})

fs.writeFile(__dirname + '/async-write.txt',"this is an async operation",err=>{
    if(err){
        throw new Error('error writing file')
    }else{
        console.log("written successfully");
    }
})

console.log("I am number 2");