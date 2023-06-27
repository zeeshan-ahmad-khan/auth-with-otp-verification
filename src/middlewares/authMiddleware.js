const jwt = require("jsonwebtoken");

function protect(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const tokenData = jwt.verify(token, process.env.JWT_SECRET)

            req.user = tokenData.user_id;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized!")
        }
    }

    if (!token) {
        throw new Error("No Token Found!")
    }
}

module.exports = protect;