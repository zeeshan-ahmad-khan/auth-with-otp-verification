const express = require('express');
const app = express();
require('dotenv').config();
const cors = require("cors");

const connectDb = require('./src/db/connection');
const authRouter = require('./src/routes/authRoute');
const otpRouter = require('./src/routes/otpRoutes');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const PORT = process.env.PORT || 5713;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// routes
app.use("/api/auth", authRouter)
app.use("/otp", otpRouter)

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
    connectDb();
})