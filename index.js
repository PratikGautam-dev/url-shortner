const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const { checkAuth } = require("./middleware/auth");
const URL = require('./model/url');

const urlRoute = require('./routers/url');
const staticRoute = require("./routers/staticRouter");
const userRoute = require('./routers/user');

const { connectToMongoose } = require('./connection');
const app = express();

connectToMongoose('mongodb://127.0.0.1:27017/shorturl').then(() => {
    console.log("mongoose connected");
});

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

const PORT = 8001;
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));