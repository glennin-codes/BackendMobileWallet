const { startNgrok } = require("../../../ngrok.js");

const { default: axios } = require("axios");
const depositFunds = require("./depositFunds.js");
const { Transactions } = require("../../../Models/transactions.js");

require("dotenv").config();

let merchantRequestId;
// let userId;

// const ngrokStart = async () => {
//   try {
//     ngrokUrl = await startNgrok();
//     console.log(ngrokUrl);
//   } catch (e) {
//     console.log(e.message);
//   }
// };
// ngrokStart();

let paymentData = {};
let amount;
let userId
const stkPush = async (req, res) => {
userId = req.body.userId;
  const ngrokUrl = await startNgrok();
  paymentData={...paymentData,userId:req.body.userId, phone:req.body.phone,amount:req.body.amount}
  const phone = req.body.phone; // removing the 0 from the number
  amount = req.body.amount;
  const token = req.token;
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
    CallBackURL: `https://kind-plum-betta-cap.cyclic.cloud/api/deposit/call_back`,
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
      const initialPayment =  Transactions.create({
        userId: req.body.userId,
        phone: req.body.phone,
        amount: req.body.amount,
        trnx_id:null
        // Other fields you want to store initially
      });
      res.status(200).json({res:response.data,initialPayment});

    })
    .catch((err) => {
      console.error(err + "hhhh");
      res.status(400).json(JSON.stringify(err) + "hhhh");
    });
};
let callBackData = null;
let callBackDataPromise = null;

const callBack = async (req, res) => {
  console.log(paymentData);
  // here mpesa sends the results of the transaction in req.body
  callBackData = req.body;
  console.log(callBackData);

  if (callBackDataPromise) {
    callBackDataPromise.resolve(callBackData);
  }

  try {
    const { Body } = callBackData;
    const { stkCallback } = Body;

    if (stkCallback.ResultCode !== 0) {
      return console.log(`the user cancelled the request`);
    }

    console.log(stkCallback.CallbackMetadata);

    const trnx_id = stkCallback.CallbackMetadata.Item[1].Value;

    paymentData={...paymentData, trnx_id}
    const initialPayment = await Transactions.findOne({
      userId: userId,
      amount:amount
      });

    if (!initialPayment) {
      return res.status(404).json({ message: "Initial payment data not found" });
    }

    // Update the payment record with trnx_id
    initialPayment.trnx_id = trnx_id; // Assuming trnx_id is available in this scope
    await initialPayment.save();

      res.status(200).send({ message: "saved to db" });

  } catch (error) {
    res.status(500).json("server error");
  }
};

const getcallBackData = async (req, res) => {
  if (callBackData) {
    // If callBackData is already available, return it immediately
    console.log(callBackData);
    return res.status(200).json(callBackData);
  }

  // If callBackData is not available yet, create a promise that resolves when it is
  if (!callBackDataPromise) {
    callBackDataPromise = {};
    callBackDataPromise.promise = new Promise((resolve) => {
      callBackDataPromise.resolve = resolve;
    });
  }

  // Wait for the promise to resolve
  const data = await callBackDataPromise.promise;
  res.status(200).json(data);
};

module.exports = { stkPush, callBack, getcallBackData };
