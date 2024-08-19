var express = require('express');
var router = express.Router();
const { makeDeposit } = require('../services/paymentService');
const { updateWallet } = require('../services/walletService');
const { decodeToken } = require('../utils/jwt');
const { User, Wallet, Transaction } = require('../models');


router.get('/deposit', function (req, res) {
    res.render('deposit');
});

router.post('/deposit', async function (req, res) {
  const userIdentifier = decodeToken(req.session.token);
  const { orderId, amount } = req.body;

  try {
      const user = await User.findOne({ where: { id: userIdentifier.id } });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const fullName = user.fullName;
      const depositResult = await makeDeposit(orderId, parseFloat(amount), fullName);

      if (depositResult.status === 1) {
          await updateWallet(user.id, depositResult.amount);
          await Transaction.create({
              type: 'deposit',
              amount: depositResult.amount,
              status: depositResult.status,
              userId: user.id
          });
          return res.json({ success: true, depositResult });
      } else {
          return res.json({ success: false, depositResult });
      }
  } catch (error) {
      console.error('Error handling deposit request:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/withdraw', async function (req, res) {
    const userIdentifier = decodeToken(req.session.token);
    const { orderId, amount } = req.body;

    try {
        // Find user by ID
        const user = await User.findOne({ where: { id: userIdentifier.id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, message: 'Withdrawal processed' });
    } catch (error) {
        console.error('Error handling withdrawal request:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
