const express = require('express')
const { listContacts, getContactById, addContact, updateContact, removeContact } = require('../../controllers')
const { isValidId } = require('../../middlewares')
const router = express.Router()

router.get('/', listContacts)

router.get('/:contactId', isValidId, getContactById)

router.post('/', addContact)

router.put('/:contactId', isValidId, updateContact)

router.delete('/:contactId', isValidId, removeContact)


module.exports = router
