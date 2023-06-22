const bookmodel = require('../models/bookmodel')
const Mvalidator = require('validator') 
const mongoose = require('mongoose')
const usermodel = require('../models/usermodel')
const reviewmodel = require('../models/reviewmodel')
const ObjectId = mongoose.Types.ObjectId
const ISBN_REGEX = /^(?:ISBN(?:-1[03])?:? )?(?=[-0-9\s]{17}$|[-0-9X\s]{13}$|[0-9X\s]{10}$)(?:97[89][-–]?)?[0-9]{1,5}[-–]?[0-9]+[-–]?[0-9]+[-–]?[0-9X]$/

const isValidValue = function(value) { //function to check entered data is valid or not
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length === 0) return false;
    return true;
}
let validregex = /^[a-zA-Z ]{3,30}$/
let validsubcategory = /^[a-zA-Z ,]{3,150}$/



const createbook = async function(req,res){
    let Data = req.body
    let {title,excerpt,userId,ISBN,category,subcategory,releasedAt,isDeleted} = Data
    if(req.userId != userId) {return res.status(403).send({status: false, message: 'Not authorised'})}
    req.userId = userId
    try {
        if(!(title || excerpt || userId || ISBN || category || subcategory || releasedAt)) {return res.status(400).send({ status:false , message: 'Please filled required filled'})}
        
        if(!isValidValue(title)) {return res.status(400).send({status: false , message: 'title is invalid'})}
        const checkDupliate = await bookmodel.findOne({title : title})
        if(checkDupliate)  {return res.status(400).send({status: false, message: 'Book title already exist'})}

        if(!isValidValue(ISBN)) {return res.status(400).send({status: false , message: 'ISBN type is wrong'})}
        
        if(!ISBN_REGEX.test(ISBN)) {return res.status(400).send({status:false, message: 'Invalid ISBN'})}
        const checkDuplicateIsbn = await bookmodel.findOne({ISBN: ISBN})
        if(checkDuplicateIsbn) {return res.status(400).send({status: false , message: 'ISBN already present'})}

        if(!ObjectId.isValid(userId)) {return res.status(400).send({status : false , message: 'Object Id is not valid'})}
        const checkUserId = await usermodel.findById(userId)
        if(!checkUserId) {return res.status(404).send({status:false , message: 'User not found'})}

        if(!isValidValue(excerpt)) {return res.status(400).send({status:false , message: "invalid excerpt"})}
        if(!isValidValue(category)) {return res.status(400).send({status: false, message: "Invalid category"})}

        if(!isValidValue(subcategory)) {return res.status(400).send({status: false, message: "Invalid subcategory"})}
        
        if(!isValidValue(releasedAt)) {return res.status(400).send({status: false , message: 'Invalid released type'})}
        if(!Mvalidator.isDate(releasedAt)) {return res.status(400).send({status: false , message: 'Invalid released format'})}
        if(isDeleted == true ) {Data.isDeleted = true , deletedAt = Date.now()}

        const createbook = await bookmodel.create(Data)
        res.status(201).send({status: true, data: createbook})

    } 
    catch (error) {
        res.status(500).send(error.message)
    }
}


const getbookById = async function(req,res){
    let idFromParam = req.params.bookId
    console.log(idFromParam)
    try {
        if(!idFromParam) {return res.status(404).send({status: false , message: "Please Enter Id it's mandatory"})}
        if(!ObjectId.isValid(idFromParam)) {return res.status(400).send({status: false, message : "ObjectId is not valid"})}


        const checkDatabase = await bookmodel.findOne({_id: idFromParam , isDeleted: false}).lean()
        if(!checkDatabase) {res.status(404).send("Book not found")}
        else{
            if(req.userId != checkDatabase.userId) {return res.status(403).send({status:false, message: 'Unauthorised'})}
            const checkreview = await reviewmodel.findOne({bookId: idFromParam})
                if(!checkreview) {
                const data = {...checkDatabase, reviewsData: []}
                {return res.status(200).send({status: true , message: 'book-list' , data: data})}
                }
                const data = {...checkDatabase, reviewsData: checkreview}
                res.status(200).send({status: true , message: 'book-list' , data: data})
        }
    }
     catch (error) {
        res.status(500).send(error.message)
    }
}

const getBook = async function(req, res) {
    try {
        let query = req.query

        if (Object.keys(req.query).length == 0) {
            const allBookData = await bookmodel.find({ isDeleted: false }).sort({ title: 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            if (!allBookData) {
                return res.status(404).send({ status: "false", message: "No Book Found" })
            }

            return res.status(200).send({ status: "true", message: "Success", data: allBookData })

        } else {

            const bookData = await bookmodel.find({ isDeleted: false, $and: [query] }).sort({ title: 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

            if (bookData.length == 0) {
                return res.status(404).send({ status: "false", massege: "No Book Found" })
            }

            return res.status(200).send({ status: "true", message: "Success", data: bookData })
        }

    } catch (error) {
        console.log("This is the error :", error.message)
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}
 

const updateById = async function(req,res){
    let idFromParam = req.params.bookId
    let Data = req.body
    let {title,excerpt,ISBN,releasedAt} = Data
    try {

       if(!idFromParam) {return res.status(400).send({status:false , message: 'Id not found'})}
       if(!ObjectId.isValid(idFromParam)) {return res.status(404).send({status: false , message: 'Id is not valid'})}
       const checkId = await bookmodel.findById(idFromParam) 
        if(!checkId) {return res.status(400).send({status: false , message: "Id not found"})}
       
      
        const duplicateTitle = await bookmodel.findOne({title: title})
        if(duplicateTitle) {return res.status(400).send({status: false, message: "title already present"})}

        const duplicateExcerpt = await bookmodel.findOne({excerpt: excerpt})
        if(duplicateExcerpt) {return res.status(400).send({status: false, message: "Excerpt already present"})}

        if(ISBN){
        if(!ISBN_REGEX.test(ISBN)) {return res.status(400).send({status:false, message: 'Invalid ISBN'})}
        const duplicateIsbn = await bookmodel.findOne({ISBN : ISBN})
        if(duplicateIsbn) {return res.status(400).send({status: false, message: 'ISBN already exist'})}
        }

        if(releasedAt){
            if(!Mvalidator.isDate(releasedAt)) {return res.status(400).send({status: false, message: 'Format is not right '})}
        }

        const checkDeleted = await bookmodel.findById(idFromParam)
        if(checkDeleted.isDeleted == true) {return res.status(400).send({status:false, message: 'already deleted'})}

        if(req.userId != checkDeleted.userId) {return res.status(403).send({status:false , message: 'You are not authorized'})}

        const update = await bookmodel. findOneAndUpdate({_id: idFromParam, isDeleted: false },Data,{updatedAt: Date.now }, {new:true})
        res.status(200).send({status: true, message: 'book update succesfully', data: update})

    } catch (error) {
        res.status(500).send(error.message)
    } 
}


const deleteById = async function (req,res){
    idFromParam = req.params.bookId
    try {
        if(!ObjectId.isValid(idFromParam)){return res.status(400).send({status: false, message: 'Id is not valid '})}
        
        const checkDeleted = await bookmodel.findById(idFromParam)
        if(!checkDeleted) {return res.status(404).send({status: false, message: 'Page not found'})}
        if(checkDeleted.isDeleted == true) {return res.status(400).send({status:false, message: 'already deleted'})}

        if(req.userId != checkDeleted.userId) {return res.status(403).send({status:false, message: 'You are not authorized'}) }

        const deleteDocument = await bookmodel.findOneAndUpdate({_id: idFromParam},{isDeleted: true, deletedAt: Date.now()},{new: true})
        res.status(200).send({status: true, message: "deleted succesfully"})

    } catch (error) {
        
    }
}
 
module.exports.createbook = createbook
module.exports.getbookById = getbookById
module.exports.getBook = getBook
module.exports.updateById = updateById
module.exports.deleteById = deleteById
