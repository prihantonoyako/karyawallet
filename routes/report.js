var express = require('express')
var router = express.Router();
const { User, Transaction } = require('../models');
const { auth } = require('../middlewares/auth');

router.use(auth);

router.get('/transactions', async (req, res) => {
    const transactions = await Transaction.findAll({ include: [User] });
    res.render('transactions', { transactions });
});

module.exports = router;