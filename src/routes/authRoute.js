const router = require('express').Router();
const { login, register } = require('../controllers/authControllers');

router.route("/login").post(login)
router.route("/register").post(register)

module.exports = router;