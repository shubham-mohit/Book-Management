const usermodel = require('../models/usermodel')
const validator = require('email-validator')
const mobileRegex = /^[0-9]{10}$/;
const Mvalidator = require('validator')
const Secrate_key = "Shubham-key"
const jwt = require('jsonwebtoken')

const isValid = function(value) { //function to check entered data is valid or not
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length === 0) return false;
    return true;
}


const createuser = async function(req,res){
    let Data = req.body
    let{title,name,phone,email,password, address} = Data
    const pincode = Data.address.pincode
    try {
        if(!(title || name || phone || email || password)) {return res.status(400).send({ status:false , message :'please filled the required field'})}

        if(!isValid(title)) {return res.status(400).send({status: false , message: "title data type is wrong"})}
        if(!isValid(name)) {return res.status(400).send({status: false , message: "name data type is wrong"})}
        if(!isValid(phone)) {return res.status(400).send({status: false , message: "phone data type is wrong"})}
        if(!isValid(email)) {return res.status(400).send({status: false , message: "email data type is wrong"})}
        if(!isValid(password)) {return res.status(400).send({status: false , message: "password data type is wrong"})}


        if(! title.includes( "Mr"|| "Mrs" || "Miss" )) {return res.status(400).send({ status : false , message : "Enter valid title"})}

        if(! validator.validate(email)) {return res.status(400).send({status: false , message : 'Please Enter a valid Email-Id'})}
        const checkEmail = await usermodel.findOne({email:email})
        if(checkEmail) {return res.status(400).send({status: false, message: "Email already in use"})}

        if(!mobileRegex.test(phone)) {return res.status(400).send({status: false , Message:'Mobile number is not valid'})}
        const checkMobile = await usermodel.findOne({phone:phone})
        if(checkMobile) {return res.status(400).send({status: false , Message: 'Mobile Number already in use'})}

        if(!(password.length >= 8 && password.length <= 15)) { return res.status(400).send({status: false , message: 'Enter strong password'})}

        if (address) {
            if (typeof address !== 'object') {
                return res.status(400).send({ status: false, message: "Address is not in correct format" })
            }

            if (pincode) {
                if (!/^[0-9]{6}$/.test(pincode)) {
                    return res.status(400).send({ status: false, message: "Pin code needed in valid format." })
                }
            }
        }

        const createUser = await usermodel.create(Data)
        res.status(201).send({status: true , data : createUser})
    } 
    catch (error) {
        res.status(500).send(error.message)
    }
}

const login = async function(req, res) {
    try {
        let email = req.body.email;
        if (!email) return res.status(400).send({
            status: false,
            message: "Email Is Not Given"
        })
        let password = req.body.password;
        if (!password) return res.status(400).send({
            status: false,
            message: "Password Is Not Given"
        })

        let User = await usermodel.findOne({ email: email, password: password });
        if (!User) return res.status(404).send({ status: false, message: "Email-Id or the password is not Valid" });

        let token = jwt.sign({
                UserId: User._id.toString(),
                iat: Date.now(),
                exp: (Date.now()) + (60 * 1000) * 2
            },
            "functionup-project-4"
        );
        res.setHeader("x-api-key", token);

        return res.status(200).send({ status: true, message: "Successfull Log In", token: token });

    } catch (error) {

        return res.status(500).send({ message: "Error", error: error.message })
    }
};

module.exports.createuser = createuser
module.exports.login = login