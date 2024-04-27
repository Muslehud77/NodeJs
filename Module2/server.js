const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://<username>:<password>@cluster0.q9bdeff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const http = require("http");
const url = require("url");
const fs = require("fs");

const posts = fs.createReadStream(__dirname + "/posts.json", "utf-8");
const html = fs.createReadStream(__dirname + "/index.html", "utf-8");

const server = http.createServer((req, res) => {
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
});

server.listen(5000, "127.0.0.1", () => {
  console.log("server is listening on port 5000");
});
