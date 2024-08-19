const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { Op } = require('sequelize'); // Import Op from Sequelize

const login = async (identifier, password) => {
    const transaction = await sequelize.transaction();

    try {
        // Look up by either username or email
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: identifier },
                    { email: identifier }
                ]
            },
            transaction
        });

        if (!user) {
            return false;
        }

        // Check password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return false;
        }

        // Generate token
        const token = generateToken(user);
        await transaction.commit();

        return token;
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return false;
    }
};

module.exports = { login };
