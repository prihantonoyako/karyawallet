const generateTokenKaryaPay = (fullName) => {
    return Buffer.from(fullName).toString('base64');
};

module.exports = { generateTokenKaryaPay };