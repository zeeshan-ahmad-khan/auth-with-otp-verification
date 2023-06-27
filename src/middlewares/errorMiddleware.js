function errorMiddleware(err, req, res, next) {
    res.json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    })
    next();
}

module.exports = errorMiddleware;