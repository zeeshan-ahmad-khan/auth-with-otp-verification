const expressHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Auth = require("../model/authModel");

const login = expressHandler(async (req, res) => {
    const { credential, password } = req.body;

    const user = await Auth.findOne({ $or: [{ username: credential }, { email: credential }] })

    if (!user) {
        throw new Error("User does not exists!");
    }

    const comparedPassword = await bcrypt.compare(password, user.password);

    if (!comparedPassword) {
        throw new Error("Incorrect Password!");
    }

    if (!user.verified) {
        throw new Error("Please verify your email account");
    }

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    })

    res.status(200).json({ success: true, user_id: user._id, username: user.username, email: user.email, token })
})

const register = expressHandler(async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;

    const foundUser = await Auth.findOne({ email });

    if (foundUser) {
        throw new Error("User already exists!")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({ firstname, lastname, username, email, password: hashedPassword })

    if (!user) {
        throw new Error("Something went wrong!")
    }

    res.status(200).json({ success: true, message: "User registered successfully!" })
})

module.exports = { login, register }