const mongoose = require('mongoose')
const ObjectId = mongoose.Types.Schema.ObjectId

const bookSchema = new mongoose.Schema({
    title: {type : String, unique: true, required: true},
  excerpt: {type : String, unique: true}, 
  userId: {
    type : ObjectId,
    ref : "usermodel"
    },
  ISBN: {type: String, required: true, unique: true},
  category: {type: String , required: true},
  subcategory: {type: String , required: true},
  reviews: {
    type : Number,
    default : 0,
    comments: {type : String}
  },
  deletedAt: {type : Date}, 
  isDeleted: {type : Boolean, default: false},
  releasedAt: {type: Boolean , required: true}
},{ timestamp : true })


module.exports = mongoose.model('bookmodel', bookSchema)