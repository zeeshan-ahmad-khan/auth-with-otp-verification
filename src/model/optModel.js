const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Otp", otpSchema);