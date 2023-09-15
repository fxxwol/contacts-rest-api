const express = require('express')
const { ctrl } = require('../../controllers/')
const { isValidId, authenticate } = require('../../middlewares')
const router = express.Router()
router.get('/', ctrl.listContacts)

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById)

router.post('/', authenticate, ctrl.addContact)

router.put('/:contactId', authenticate, isValidId, ctrl.updateContact)

router.patch('/:contactId/favorite', authenticate, isValidId, ctrl.updateStatus);

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact)



module.exports = router
