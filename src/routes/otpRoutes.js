const router = require('express').Router();
const { sendOtp, verifyOtp } = require('../controllers/otpControllers');

router.route("/sendOtp").post(sendOtp)
router.route("/verify").post(verifyOtp)

module.exports = router;