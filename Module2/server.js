const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const localURI = "mongodb://localhost:27017";
const http = require("http");
const url = require("url");
const fs = require("fs");

const posts = fs.createReadStream(__dirname + "/posts.json", "utf-8");
const html = fs.createReadStream(__dirname + "/index.html", "utf-8");







const client = new MongoClient(localURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
  
    await client.connect();
    
    
    await client.db("admin").command({ ping: 1 });
    console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
    );


     const postsCollection = client.db("postsCollection").collection("posts");

    const server = http.createServer(async(req, res) => {
      console.log(req.url, req.method);
  
      const parsedURL = new URL(req.url, `http://${req.headers.host}`);
  
      const pathname = parsedURL.pathname;
  
      if (pathname === "/" && req.method === "GET") {
        res.end("hello from server world");
      } else if (pathname === "/home" && req.method === "GET") {
        fs.readFile(__dirname + "/index.html", "utf-8", (err, data) => {
          if (err) {
            throw new Error("Error reading file");
          }
          res.writeHead(200, { "Content-type": "text/html" });
  
          res.end(data);
        });
      } else if (pathname === "/posts" && req.method === "GET") {
        // res.writeHead(200,{
        //     "Content-type" : "application/json",
        //     Email : 'hae@hae.com'
        // })
        res.setHeader("Content-type", "application/json");
        res.statusCode = 200;
  
        const query = parsedURL.searchParams.get("id");
        posts.on("data", (data) => {
          if (query) {
            const searchResult = JSON.parse(data).find(
              (post) => post.userId === parseInt(query)
            );
            res.end(JSON.stringify(searchResult));
          } else {
            res.end(data);
          }
        });
      }
      else if(pathname === '/create-post' && req.method === 'POST'){
        let body = ''

        req.on('data',(buffer)=>{
          body = buffer.toString();
        })

        req.on("end",async ()=>{

          const data = JSON.parse(body)
          const result =  await postsCollection.insertOne(data)
         
            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify({message:"post created successfully!",data:result}))
        })

      }else if (pathname.startsWith("/update-post") && req.method === "PATCH") {
        const postId = pathname.split("/")[2];
        let body = "";

        req.on("data", (buffer) => {
          body = buffer.toString();
        });

        req.on("end", async () => {
          const data = JSON.parse(body);
          const id = { _id: new ObjectId(postId) };
          const result = await postsCollection.updateOne(id, { $set: data });

          res.writeHead(200, { "Content-type": "application/json" });
          res.end(
            JSON.stringify({
              message: "post updated successfully!",
              data: result,
            })
          );
        });
      } else if (
        pathname.startsWith("/delete-post") &&
        req.method === "DELETE"
      ) {
        const postId = pathname.split("/")[2];
     
          const id = { _id: new ObjectId(postId) };
          const result = await postsCollection.deleteOne(id);

          res.writeHead(200, { "Content-type": "application/json" });
          res.end(
            JSON.stringify({
              message: "post deleted successfully!",
              data: result,
            })
          );
        
      } else {
        res.end("not found");
      }
    });
  
  server.listen(5000, "127.0.0.1", () => {
    console.log("server is listening on port 5000");
  });


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
