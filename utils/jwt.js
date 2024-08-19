const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const secretKey = 'KaryaWallet';

    const payloadData = {
            id: payload.id,
            username: payload.username,
            email: payload.email
    };

    const options = {
        expiresIn: '15m',
    };

    const token = jwt.sign(payloadData, secretKey, options);

    return token;
};

const decodeToken = (token) => {
    if (!token) {
      throw new Error('No token provided');
    }
  
    try {
      return jwt.verify(token, "KaryaWallet");
    } catch (err) {
      throw new Error('Invalid token');
    }
  };

module.exports = { generateToken, decodeToken };