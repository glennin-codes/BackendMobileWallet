const { startNgrok } = require("../../../ngrok.js");

const { Transactions } = require("../../../Models/transactions.js");
const { default: axios } = require("axios");

require("dotenv").config();

let ngrokUrl;
let merchantRequestId;

const ngrokStart = async () => {
  try {
    ngrokUrl = await startNgrok();
    console.log(ngrokUrl);
  } catch (e) {
    console.log(e.message);
  }
};
ngrokStart();

let paymentData = {};
const stkPush = async (req, res) => {
  // const ngrokUrl = await startNgrok();
  paymentData = {
    ...paymentData,
    phone: req.body.phone,
    amount: req.body.amount,
   email:req.body.email
  };
  const phone = req.body.phone.substring(1); // removing the 0 from the number
  const amount = req.body.amount;
  // res.json({ phone, amount });
  console.log(req.body);
  //timestamp
  const date = new Date();
  const timeStamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + (date.getDate() + 1)).slice(-2) +
    ("0" + (date.getHours() + 1)).slice(-2) +
    ("0" + (date.getMinutes() + 1)).slice(-2) +
    ("0" + (date.getSeconds() + 1)).slice(-2); // time stamp  IN THE FORM OF YYYYMMDDHHmmss

  const shortCode = process.env.MPESA_PAYBILL;
  const passKey = process.env.MPESA_PASSKEY;
  const Url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"; // where to send the stk push requestg

  //(The base64 string is a combination of Shortcode+Passkey+Timestamp)
  const password = new Buffer.from(shortCode + passKey + timeStamp).toString(
    "base64"
  ); // THE PASSWORD IS A COMBINATION OF THIS 3 THINGS I.E BASE64 STRING
  //stk bodyy

  const Data = {
    BusinessShortCode: shortCode, // ACTUAL PAYBILL
    Password: password, //COMBINING SHORTCODE,PASSKEY AND TIMESATAMP
    Timestamp: timeStamp, //time stamp  IN THE FORM OF YYYYMMDDHHmmss
    TransactionType: "CustomerPayBillOnline", //" OR CustomerBuyGoodsOnline"
    Amount: amount,
    PartyA: `254${phone}`, //USERS PHONE NUMBER
    PartyB: shortCode, // OUR PAY BILL
    PhoneNumber: `254${phone}`, //USERS PHONE NUMBER
    CallBackURL: `${ngrokUrl}/api/callback`,
    AccountReference: `MobileWallet`,
    TransactionDesc: "MobileWallet",
  };
  await axios
    .post(Url, Data, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      merchantRequestId = response.data.MerchantRequestID;
      console.log(`it is ${merchantRequestId}`);
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.error(err + "hhhh");
      res.status(400).json(JSON.stringify(err) + "hhhh");
    });
};
const callBack = async (req, res) => {
  // here mpesa sends the results of the transaction in req.body
  const callbackData = req.body;
  console.log(callbackData);
  const { Body } = callbackData;

  const { stkCallback } = Body;
  if (stkCallback.ResultCode !== 0) {
    return console.log(`the user cancelled the request`);
  }

  console.log(stkCallback.CallbackMetadata);

  const trnx_id = stkCallback.CallbackMetadata.Item[1].Value;

  paymentData = {
    ...paymentData,
    datePayed: Date.now(),
    trnx_id,
    merchantRequestId,
  };

  const sucessfulPayment = await Transactions.create(paymentData);
  if (sucessfulPayment) {
    res.status(200).send({ message: "saved to db" });
  }
};

module.exports = { stkPush, callBack };
