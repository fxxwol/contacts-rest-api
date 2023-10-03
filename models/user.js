const Joi = require('joi')
const { Schema, model } = require('mongoose')
const {patterns} = require("../helpers")

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Set password for user'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        token: String,
        avatarURL: String,
    }
    , { versionKey: false })

userSchema.post("save", (error, next) => {
    error.status = 400;
    next()
});

const User = model("user", userSchema);

const registerSchema = Joi.object({
    email: Joi.string().regex(patterns.emailPattern),
    password: Joi.string().regex(patterns.passwordPattern),
})

const schemas = { registerSchema }

module.exports = {
    User,
    schemas
}