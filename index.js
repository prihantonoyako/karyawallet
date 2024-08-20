const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session')
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const transactionRouter = require('./routes/transaction');
const reportRouter = require('./routes/report');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(session({
  secret: "karyawallet",
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    maxAge: 300000
  }
}));

app.use(express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/transaction', transactionRouter);
app.use('/report', reportRouter);

app.listen(port, () => {
  console.log('Server is running on http://localhost:' + port);
  console.log(`Payment Gateway URL: ${process.env.PAYMENT_GATEWAY}`);
});
