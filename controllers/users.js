const { User, schemas: { registerSchema } } = require('../models/user')
const { ctrlWrapper, HttpError } = require('../helpers')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const KEY = process.env.SECRET_KEY;

const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        email: newUser.email
    })
}

const login = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' })
    
    res.json({
        message: "Logout success"
    })
}

const current = async (req, res) => {
    const { email } = req.user;
    res.json({
        email
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current)
}