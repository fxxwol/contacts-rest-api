const express = require('express')
const {userCtrl} = require('../../controllers/')
const { authenticate } = require('../../middlewares')
const router = express.Router()

router.post('/register',  userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/logout', authenticate, userCtrl.logout)
router.get('/current', authenticate,  userCtrl.current)

module.exports = router