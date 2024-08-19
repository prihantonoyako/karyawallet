const { Wallet, sequelize } = require('../models');

const updateWallet = async (userId, amount) => {
  const transaction = await sequelize.transaction();

  try {
    // Find wallet associated with the user
    let wallet = await Wallet.findOne({ where: { userId }, transaction });

    if (!wallet) {
      // Create a new wallet if not found
      wallet = await Wallet.create({ userId, balance: 0 }, { transaction });
    }

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save({ transaction });

    // Commit the transaction
    await transaction.commit();
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    console.error('Error updating wallet:', error.message);
    throw error;
  }
};

module.exports = { updateWallet };
