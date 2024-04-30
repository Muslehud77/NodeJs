const express = require('express')
const router = express.Router()



module.exports = (postsCollection) => {
  router.post("/create-post", async (req, res) => {
    const post = req.body;

    const result = await postsCollection.insertOne(post);
    res.send(result);
  });

  router.patch("/update-post/:id", async (req, res) => {
    const id = req.params.id;
    const post = req.body;
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: post }
    );
    res.send(result);
  });

  router.delete("/delete-post/:id", async (req, res) => {
    const id = req.params.id;
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  });

  return router
};