const express = require('express');
const router = express.Router();
const { Usersignup, Userlogin, Userlogout } = require('../controllers/user');

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', Usersignup);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', Userlogin);

router.get('/logout', Userlogout);

module.exports = router;