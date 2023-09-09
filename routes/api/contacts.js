const express = require('express')
const ctrl = require('../../controllers/')
const { isValidId } = require('../../middlewares')
const router = express.Router()
router.get('/', ctrl.listContacts)

router.get('/:contactId', isValidId, ctrl.getContactById)

router.post('/', ctrl.addContact)

router.put('/:contactId', isValidId, ctrl.updateContact)

router.patch('/:contactId/favorite', isValidId, ctrl.updateStatus);

router.delete('/:contactId', isValidId, ctrl.removeContact)



module.exports = router
