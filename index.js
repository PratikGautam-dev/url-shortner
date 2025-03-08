require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const { checkAuth } = require("./middleware/auth");
const URL = require('./model/url');

const urlRoute = require('./routers/url');
const staticRoute = require("./routers/staticRouter");
const userRoute = require('./routers/user');

const { connectToMongoose, testConnection } = require('./connection');
const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shorturl';

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth); // Apply authentication middleware globally

app.use("/user", userRoute);
app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send("URL not found");
    }
});

const PORT = process.env.PORT || 3000;  // Changed default fallback to 3000

// Test database connection before starting server
testConnection().then(isConnected => {
    if (isConnected) {
        app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
    } else {
        console.error('Failed to connect to MongoDB. Check your connection string and network settings.');
        process.exit(1);
    }
});