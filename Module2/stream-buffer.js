const fs = require("fs");



// fs.readFile(__dirname + "/hello.txt", "utf8", (err, data) => {
//   if (err) {
//     throw new Error("Error reading file");
//   }

//   fs.writeFile(__dirname + "/async-write.txt", data, (err) => {
//     if (err) {
//       throw new Error("error writing file");
//     } else {
//       console.log("written successfully");
//     }
//   });

// });



// create a readable stream

const readableStream = fs.createReadStream(__dirname + '/hello.txt','utf8')


readableStream.on('data',(data)=>{
    // console.log(data);
    const writableStream = fs.createWriteStream(__dirname + '/buffer.txt')
    // writableStream.write(data,err=>{
    //     if(err){
    //         throw new Error('Error writing file')
    //     }else{
    //         console.log("please check");
    //     }
    // })

    readableStream.pipe(writableStream)
    writableStream.on('finish',()=>console.log('finished writing'))
  
})

readableStream.on('error',(err)=>{
    throw new Error(err)
})

