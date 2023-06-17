const express = require('express')
const mongoose = require('mongoose')
const app= express()
const route = require('./route/route')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb+srv://sourabhamohite2812:wXzbwlWssiEAjJL1@cluster0.m7awpol.mongodb.net/shubham-22' ,{useNewUrlParser: true})
.then(()=> console.log("MongoDb is connected"))
.catch((err)=> console.log(err.message))

app.listen(process.env.PORT || 3000 , function(){
    console.log('Express app running on PORT ', process.env.PORT || 3000 )
})