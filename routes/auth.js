const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { login } = require('../services/authService');

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', bodyParser.urlencoded({ extended: true}), async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      const token = await login(identifier, password);
  
      if (!token) {
        return res.render('login');
      }
  
      // Store token in session
      if (req.session) {
        req.session.token = token;
        req.session.save((err) => {
          if (err) {
            return res.status(500).send('Failed to save session');
          }
          res.redirect('/dashboard');
        });
      } else {
        res.status(500).send('Session not available');
      }
    } catch (error) {
      res.status(500).send('An error occurred');
    }
});

router.post('/logout', async (req, res) => {
  req.session.destroy();
  return res.redirect('/auth/login');
});

router.get('/register', function(req, res, next) {
    res.render('auth/register');
});

module.exports = router;
