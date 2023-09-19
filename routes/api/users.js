const express = require('express')
const {userCtrl} = require('../../controllers/')
const { authenticate, upload } = require('../../middlewares')
const router = express.Router()

router.post('/register',  userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/logout', authenticate, userCtrl.logout)
router.get('/current', authenticate, userCtrl.current)
router.patch('/', authenticate, userCtrl.changeSubscription)
router.patch('/avatars', authenticate, upload.single("avatar"), userCtrl.updateAvatar)

module.exports = router