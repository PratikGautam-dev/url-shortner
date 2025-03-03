const { getuser } = require("../services/auth");

async function checkAuth(req, res, next) {
    const Userid = req.cookies?.token;
    if (!Userid) {
        req.user = null;
        res.locals.user = null;
        return next();
    }
    const user = await getuser(Userid);
    if (!user) {
        req.user = null;
        res.locals.user = null;
        return next();
    }
    req.user = user;
    res.locals.user = user;
    next();
}

module.exports = {
    checkAuth,
};