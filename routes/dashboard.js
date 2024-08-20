const express = require('express');
const router = express.Router();
const { decodeToken } = require('../utils/jwt');
const { auth } = require('../middlewares/auth');
const { User, Wallet } = require('../models');

router.use(auth);

router.get('/', async (req, res, next) => {
    const userIdentifier = decodeToken(req.session.token);
    var userBalance = 0.00;

    try {
        const user = await User.findByPk(userIdentifier.id, {
          include: {
            model: Wallet,
            attributes: ['balance']
          }
        });
    
        if (user) {
          if (user.Wallet) {
            userBalance = user.Wallet.balance;
          }
        }
      } catch (error) {
        console.error('Error fetching user with wallet:', error);
      }

    res.render("dashboard", {balance: userBalance});
});

module.exports = router;