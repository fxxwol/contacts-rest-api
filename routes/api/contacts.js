const express = require('express')
const { listContacts, getContactById, addContact, updateContact, removeContact, updateStatus } = require('../../controllers')
const { isValidId } = require('../../middlewares')
const router = express.Router()

router.get('/', listContacts)

router.get('/:contactId', isValidId, getContactById)

router.post('/', addContact)

router.put('/:contactId', isValidId, updateContact)

router.patch('/:contactId/favorite', isValidId, updateStatus);

router.delete('/:contactId', isValidId, removeContact)



module.exports = router
