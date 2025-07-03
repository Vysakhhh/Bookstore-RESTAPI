const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()

router.post('/register-user', authController.registerUserController)
router.post('/login-user', authController.loginUserController)


module.exports = router