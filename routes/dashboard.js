const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');

router.use(auth);

router.get('/', (req, res, next) => {
    res.render("dashboard");
});

module.exports = router;