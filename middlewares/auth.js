const auth = (req, res, next) => {
    if(!req.session){
        return res.redirect('/auth/login');
    }
    if(!req.session.token) {
        return res.redirect('/auth/login');
    }
    next();
}

module.exports = { auth }