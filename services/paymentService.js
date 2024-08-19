const axios = require('axios');
const { Buffer } = require('buffer');

const generateTokenKaryaPay = (fullName) => {
  return Buffer.from(fullName).toString('base64');
};

const makeDeposit = async (orderId, amount, fullName) => {
    const timestamp = Date.now();
    const token = generateTokenKaryaPay(fullName);

    try {
        const response = await axios.post(
            `${process.env.PAYMENT_GATEWAY}/deposit`,
            {
                order_id: orderId,
                amount,
                timestamp
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

         // Safely access response data
         const { order_id, amount: responseAmount, status } = response.data;

         return { order_id, amount: responseAmount, status };
    } catch (error) {
        console.error('Payment service error:', error.message);
        return { order_id: orderId, amount, status: 2 };
    }
};

module.exports = { makeDeposit };
