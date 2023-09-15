const { PhoneBook, schemas: { addSchema, updateFavoriteSchema } } = require('../models/contact')
const { ctrlWrapper, HttpError } = require('../helpers')

const listContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    let result;
    if (favorite) {
        result = await PhoneBook.find({ owner, favorite }).populate("owner", "email")
    }
    else {
        result = await PhoneBook.find({ owner }, "", { skip, limit }).populate("owner", "email");
    }
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
    const { _id: owner } = req.user;
    const { error } = addSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const result = await PhoneBook.create({ ...req.body, owner });
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