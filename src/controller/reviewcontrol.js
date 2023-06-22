

// POST /books/:bookId/review
// Add a review for the book in reviews collection.
// Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Update the related book document by increasing its review count
// Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this

const reviewmodel = require('../models/reviewmodel')
const bookmodel = require("../models/bookmodel")
const ObjectId = mongoose.Types.ObjectId


const createReview = async function(req,res){
    let data = req.body
    let {reviewBy , reviewAt, rating, review, isDeleted } = data
    let bookIdFromParam = req.params.bookId
    if(!req.body) {return res.status(400).send({status: false , Message: "Please enter required filled"})}
    if(!bookIdFromParam) {return res.status(400).send({status:false, Message: 'Please Enter bookId '})}
    if(!ObjectId.isValid(bookIdFromParam)) {return res.status(400).send({status: false ,Message : 'ObjectId is not valid'})}

    try {
        const findbook = await bookmodel.findOne({_id: bookIdFromParam , isDeleted: false})
        if(!findbook) {return res.status(400).send({status:false , Message: 'Book not found'})}
        else{
            const reviewCount = await bookmodel.findOneAndUpdate({_id:bookIdFromParam }, {$inc : {reviews:1}})
            data.bookId = bookIdFromParam
            const reviewcreated = await reviewmodel.create(data)
            res.status(201).send({status: true , data :  reviewcreated})
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports.createReview = createReview