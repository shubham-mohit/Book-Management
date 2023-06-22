const express = require('express')
const router = express.Router()
const usercontrol = require('../controller/usercontrol')
const bookcontrol = require('../controller/bookcontrol')
const middleware = require('../middleware/middleware')

router.post('/createuser' ,usercontrol.createuser)
router.post('/loginuser', usercontrol.login)
router.post('/books', middleware.authorization,bookcontrol.createbook)
router.get('/books/:bookId',middleware.authorization,bookcontrol.getbookById)
router.get('/books', bookcontrol.getBook)
router.put('/books/:bookId', middleware.authorization,bookcontrol.updateById)
router.delete('/books/:bookId', middleware.authorization,bookcontrol.deleteById)



module.exports = router