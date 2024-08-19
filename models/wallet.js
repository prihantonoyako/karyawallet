'use strict';
const { Model } = require('sequelize');
const sequelize = require('../config/config').development;

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: 'userId' });
    }

    static async deposit(userId, amount) {
      const transaction = await sequelize.transaction();
      try {
        const wallet = await Wallet.findOne({ where: { userId }, transaction });
        
        if (!wallet) {
          await Wallet.create({ userId, balance: amount }, { transaction });
        } else {
          wallet.balance += amount;
          await wallet.save({ transaction });
        }

        await transaction.commit();
        return wallet;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  }

  Wallet.init({
    balance: DataTypes.DOUBLE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wallet',
  });

  return Wallet;
};
