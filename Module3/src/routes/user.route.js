const express = require('express')
const router = express.Router()

module.exports = (usersCollection)=>{

    router.post('/create-user',async(req,res)=>{
        console.log(req.body);
        res.json({
            message : "user created successfully!"
        })
    })

    return router 
}