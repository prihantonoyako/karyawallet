const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var transactionRouter = require('./routes/transaction');
var reportRouter = require('./routes/report'); 
var session = require('express-session')

const app = express();
dotenv.config();

console.log(`Payment Gateway URL: ${process.env.PAYMENT_GATEWAY}`);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
var port = process.env.PORT || 3000;

app.use(session({
  secret: "karyawallet",
  saveUninitialized: false,
  resave: false,
  cookie: {secure:false}
}));

app.use(express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/transaction', transactionRouter);
app.use('/report', reportRouter);

app.listen(port, () => {
  console.log('Server is running on http://localhost:' + port);
});
