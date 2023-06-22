const jwt = require('jsonwebtoken')
const { createConnection } = require('mongoose')
const Secrate_key = "functionup-project-4"



const authorization = async function(req,res,next){
  try{
        if(!req.headers['x-api-key']) {return res.status(400).send({satus: false , message: 'header not present'})}
            const Token = req.headers['x-api-key']
            if(!Token) {return res.status(401).send({status:false , message:'Token not present'})}
            const decodeToken = jwt.verify(Token , Secrate_key)
            if(!decodeToken) {return res.stataus(404).send({status: false , message : 'Token is invalid'})}
            req.userId = decodeToken.UserId
            next()
    }
catch (err){
    // res.status(500).send(error.message)
    if (err.message.includes("signature") || err.message.includes("token") || err.message.includes("malformed")) {

        // console.log(err.message)
        return res.status(401).send({ status: false, message: "You are not Authenticated" })
    }
    return res.status(500).send({ status: false, message: err.message })
}
}

module.exports.authorization = authorization
                  
