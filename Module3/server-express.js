const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const localURI = "mongodb://localhost:27017";
const express = require("express");
const app = express();
const port = 5000;


//routes
const postRouter = require('./src/routes/post.route.js')
const userRouter = require('./src/routes/user.route.js')


app.use(express.json())
// app.use(express.raw())
// app.use(express.text())
// app.use(express.urlencoded())
// app.use(express.static(__dirname+'/public'))

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
    const usersCollection = client.db("usersCollection").collection("users");

    // app.get("/", (req, res) => {
    //   res.send("Hello World");
    // });

    app.get("/home", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });

    app.use("/post", postRouter(postsCollection));
    app.use("/user", userRouter(usersCollection));

    app.listen(port, () => {
      console.log("server is running on port 5000");
    });


   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



