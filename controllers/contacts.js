const { PhoneBook, schemas: { addSchema, updateFavoriteSchema } } = require('../models/contact')
const { ctrlWrapper, HttpError } = require('../helpers')

const listContacts = async (req, res) => {

    const result = await PhoneBook.find({})
    res.json(result);

}

const getContactById = async (req, res) => {

    const { contactId } = req.params;
    const result = await PhoneBook.findById(contactId)
    if (!result) {
        throw HttpError(404, 'Not Found')
    }
    res.json(result);
}

const addContact = async (req, res) => {

    const { error } = addSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const result = await PhoneBook.create(req.body);
    res.status(201).json(result);
}

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const { error } = addSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const result = await PhoneBook.findByIdAndUpdate(contactId, req.body, { new: true })
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result)
}

const updateStatus = async (req, res) => {
    console.log(req)
    const { contactId } = req.params;
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const result = await PhoneBook.findByIdAndUpdate(contactId, req.body, { new: true })
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result)

}

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await PhoneBook.findByIdAndDelete(contactId)
    if (!result) {
        throw HttpError(404, 'Not Found')
    }
    res.json(result)
}
module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatus: ctrlWrapper(updateStatus),
    removeContact: ctrlWrapper(removeContact),
}