const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { makeDeposit } = require('../services/paymentService');
const { updateWallet } = require('../services/walletService');
const { decodeToken } = require('../utils/jwt');
const { User, Wallet, Transaction } = require('../models');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/deposit', (req, res) => {
    res.render('deposit');
});

router.get('/withdraw', (req, res) => {
  res.render('withdraw');
});

router.post('/deposit', async (req, res) => {
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
          return res.redirect('/report/transactions')
      } else {
          return res.json({ success: false, depositResult });
      }
  } catch (error) {
      console.error('Error handling deposit request:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/withdraw', async (req, res) => {
  const userIdentifier = decodeToken(req.session.token);
  const { orderId, amount } = req.body;

  try {
    const user = await User.findOne({ where: { id: userIdentifier.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if wallet exists
    const wallet = await Wallet.findOne({ where: { userId: user.id } });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Check if balance is sufficient
    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await updateWallet(user.id, -parseFloat(amount));
    await Transaction.create({
      type: 'withdrawal',
      amount: parseFloat(amount),
      status: 1,
      userId: user.id
    });

    return res.redirect('/report/transactions');
  } catch (error) {
    console.error('Error handling withdrawal request:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
