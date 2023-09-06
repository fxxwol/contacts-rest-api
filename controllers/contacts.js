const { PhoneBook, schemas: {addSchema} } = require('../models/contact')
const { ctrlWrapper, HttpError } = require('../helpers')

const listContacts = async (req, res, next) => {
    try {
        const result = await PhoneBook.find({})
        res.json(result);
    } catch (error) {
        next(error);
    }
}

const getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await PhoneBook.findById(contactId)
        if (!result) {
            throw HttpError(404, 'Not Found')
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
}

const addContact = async (req, res, next) => {
    try {
        const { error } = addSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message)
        }
        const result = await PhoneBook.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
}

const updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { error } = addSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message)
        }
        const result = await PhoneBook.findByIdAndUpdate(contactId, req.body, {new: true})
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const removeContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await PhoneBook.findByIdAndDelete(contactId)
        if (!result) {
            throw HttpError(404, 'Not Found')
        }
        res.json(result)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    removeContact: ctrlWrapper(removeContact)
}