const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Otp = require("../model/optModel");
const Auth = require("../model/authModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cale.block@ethereal.email',
        pass: '6CzeFU9yXHWdCZGtKv'
    }
});

const sendOtp = asyncHandler(async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        throw new Error("User Id is required");
    }

    const OTP = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const hashedOtp = await bcrypt.hash(OTP.toString(), 10);

    const mailOptions = {
        form: 'cale.block@ethereal.email',
        to: 'moxac85342@edulena.com',
        subject: 'Verify your email account',
        html: `<h1>Verfiy you email account</h1>
        <p><strong>${OTP}</strong> is the OTP to verify you email account</p><i>Do not share it with anyone.</i>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw new Error(info.response);
        }
    });

    const otp = await Otp.create({ user_id, otp: hashedOtp, createdAt: Date.now(), expiredAt: Date.now() + 300000 })

    if (!otp) {
        throw new Error("Something went wrong!")
    }

    res.status(200).json({ status: true, message: "OTP sent successfully! Please check your email." });
})

const verifyOtp = asyncHandler(async (req, res) => {
    const { user_id, otp } = req.body;

    if (!user_id || !otp) {
        throw new Error("Please provide user id and/or otp");
    }

    const OTP = await Otp.find({ user_id }).sort({ expiredAt: -1 });

    if (OTP.length === 0) {
        throw new Error("Please generate OTP!");
    }

    const { expiredAt } = OTP[0];

    if (expiredAt < Date.now()) {
        throw new Error("OTP has Expired! Please generate new OTP")
    }

    const isOtpValid = await bcrypt.compare(otp, OTP[0].otp);

    if (!isOtpValid) {
        throw new Error("Wrong OTP or OTP had expired!")
    }

    const user = await Auth.findOneAndUpdate({ _id: user_id }, { verified: true });
    const otps = await Otp.deleteMany({ user_id });

    if (!user || !otps) {
        throw new Error("Something went wrong!")
    }

    res.status(200).json({ success: true, message: "Email verified successfully!" })
})

module.exports = {
    sendOtp, verifyOtp
}