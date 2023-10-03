const Joi = require('joi')
const { Schema, model } = require('mongoose')
const { handleMongooseError } = require('../middlewares')
const { patterns } = require("../helpers")


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
      match: patterns.phonePattern,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
  }
  , { versionKey: false })

contactSchema.post("save", handleMongooseError);

const PhoneBook = model("contact", contactSchema)

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().regex(patterns.phonePattern).required(),
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