var express = require('express');
var router = express.Router();
const { login } = require('../services/authService');

router.get('/login', function(req, res, next) {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      const token = await login(identifier, password);
  
      if (!token) {
        return res.status(401).send("Wrong credentials");
      }
  
      // Store token in session
      if (req.session) {
        req.session.token = token;
        req.session.save((err) => {
          if (err) {
            return res.status(500).send('Failed to save session');
          }
          res.redirect('/transaction/deposit');
        });
      } else {
        res.status(500).send('Session not available');
      }
    } catch (error) {
      res.status(500).send('An error occurred');
    }
});

router.get('/register', function(req, res, next) {
    res.render('auth/register');
});

module.exports = router;
