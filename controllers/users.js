const { User, schemas: { registerSchema, emailSchema } } = require('../models/user')
const { ctrlWrapper, HttpError, sendEmail } = require('../helpers')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const gravatar = require('gravatar');
const fs = require('fs/promises')
const Jimp = require('jimp')
require('dotenv').config();
const { nanoid } = require("nanoid");

const { SECRET_KEY, BASE_URL} = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail)

    res.status(201).json({
        email: newUser.email
    })
}

const verifyEmail = async (req, res) => {
    const { error } = emailSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(401, "Email not found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    res.json({
        message: "Email verify success"
    })
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw HttpError(400, "missing required field email")
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email is not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verify email send success"
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

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
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
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail:ctrlWrapper(resendVerifyEmail)
}