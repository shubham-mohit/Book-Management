const mongoose = require('mongoose')
const bookmodel = require('./bookmodel')
const ObjectId = mongoose.Types.Schema.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref : "bookmodel"
    },
    reviewedBy : {
        type : String,
        required : true,
        default : "Guest",
        value : {type: String}
    },
    reviewedAt: {type : Date , required : true},
    rating: {type: Number, enum:[1,2,3,4,5]},
    review: {type: String},
    isDeleted: {type: Boolean, default: false},
})

module.exports = mongoose.model('reviewmodel', reviewSchema)