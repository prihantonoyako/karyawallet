const auth = (req, res, next) => {
    if(!req.session.token) {
        res.redirect('/auth/login');
    }
    next()
}

module.exports = { auth }