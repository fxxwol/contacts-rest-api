const { User, schemas: { registerSchema } } = require('../models/user')
const { ctrlWrapper, HttpError } = require('../helpers')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const gravatar = require('gravatar');
const fs = require('fs/promises')
const Jimp = require('jimp')
require('dotenv').config();
const KEY = process.env.SECRET_KEY;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const avatarURL = gravatar.url(email);

    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

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

const changeSubscription = async (req, res) => {
    const { subscription } = req.body;
    const { _id } = req.user;

    const allowedSubscriptions = ['starter', 'pro', 'business'];

    if (!allowedSubscriptions.includes(subscription)) {
         throw HttpError(400);
    }

    const result = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
    res.json(result);
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    if (!req.file) {
        throw HttpError(400)
    }
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    const image = await Jimp.read(`./tmp/${originalname}`);
    await image.resize(250, 250).writeAsync(`./tmp/${originalname}`);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL,
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
    changeSubscription: ctrlWrapper(changeSubscription),
    updateAvatar: ctrlWrapper(updateAvatar)
}