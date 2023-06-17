const usermodel = require('../models/usermodel')
const validator = require('email-validator')
const mobileRegex = /^[0-9]{10}$/;
const Mvalidator = require('validator')
const Secrate_key = "Shubham-key"

const createuser = async function(req,res){
    let Data = req.body
    let{title,name,phone,email,password} = Data
    try {
        if(title || name || phone || email || password) {return res.status(400).send({ status:false , message :'please filled the required field'})}
        if(! title.includes( "Mr"|| "Mrs" || "Miss" )) {return res.status(400).send({ status : false , message : "Enter valid details"})}

        if(! validator.validate(email)) {return res.status(400).send({status: false , message : 'Please Enter a valid Email-Id'})}
        const checkEmail = await usermodel.findOne({email:email})
        if(checkEmail) {return res.status(400).send({status: false, message: "Email already in use"})}

        if(!mobileRegex.test(phone)) {return res.status(400).send({status: false , Message:'Mobile number is not valid'})}
        const checkMobile = await usermodel.findOne({phone:phone})
        if(checkMobile) {return res.status(400).send({status: false , Message: 'Mobile Number already in use'})}

        if(! Mvalidator.isStrongPassword(password)) {res.status(400).send({status: false , message: 'Enter strong password'})}

        const createUser = await usermodel.create(Data)
        res.status(201).send({status: true , data : createUser})
    } 
    catch (error) {
        res.status(500).send(error.message)
    }
}
const login = async function(req,res){
    let Data = req.body
    let {email , password} = Data
    try {
        if(! validator.validate(email)) {return res.status(400).send({status: false , message : 'Please Enter a valid Email-Id'})}
        if(!email) {return res.status(400).send({status:false , message : "please provide Email-Id"})}
        if(!password) {return res.status(400).send({status:false , message : "please provide password"})}

        const checkdetails = await usermodel.findOne({email : email , password: password})
        if(! checkdetails) {return res.status(404).send({status: false , message: "Page not found"})}
        else{
            const Token = jwt.sign({authorId: checkdetails._id }, Secrate_key)
            res.setHeader('x-api-key', Token)
            res.status(200).send({status: false , data:{token : Token} })
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports = {createuser}