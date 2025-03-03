const User = require("../model/user");
const { setUser } = require("../services/auth");

async function Usersignup(req, res) {
    const { name, email, password } = req.body;
    try {
        await User.create({
            name,
            email,
            password,
        });
        return res.redirect("/login");
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.render("signup", {
                error: "Email already exists. Please use a different email.",
            });
        }
        return res.status(500).send("Internal Server Error");
    }
}

async function Userlogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.render("login", {
            error: "Invalid Username or Password",
        });
    }
    const token = setUser(user);
    res.cookie('token', token, { httpOnly: true });
    return res.redirect("/");
}

function Userlogout(req, res) {
    res.clearCookie('token');
    return res.redirect('/');
}

module.exports = {
    Usersignup,
    Userlogin,
    Userlogout,
};