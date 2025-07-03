const express = require('express')
const router = express.Router()

const bookController=require('../controllers/bookController')
const jwtMiddleware=require('../middleware/jwtMiddleware')

router.use(jwtMiddleware)

router.get('/getBooks',bookController.getBooksController)
router.get('/getBook/:id',bookController.getBooksByIdController)
router.post('/add-book',bookController.addBookController)
router.put('/update-book/:id',bookController.updateBookcontroller)
router.delete('/delete-book/:id',bookController.deleteBookController)

module.exports=router