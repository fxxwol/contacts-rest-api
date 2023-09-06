const Joi = require('joi')
const { Schema, model } = require('mongoose')
const {handleMongooseError} = require('../middlewares')

const phonePattern = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      match: phonePattern,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  }
  , { versionKey: false })

contactSchema.post("save", handleMongooseError);

const PhoneBook = model("contact", contactSchema)

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().regex(phonePattern).required(),
  favorite: Joi.boolean(),
})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const schemas = { addSchema, updateFavoriteSchema }

module.exports = {
  PhoneBook,
  schemas
}