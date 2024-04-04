// const { startNgrok } = require("../../../ngrok.js");

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
userId = req.body.userId;//not necessary.the userid was to be provide when creating account for the mobile wallet but you paste a dummy id like "sdsjkdjkkuiw3093"
  // const ngrokUrl = await startNgrok();
  paymentData={...paymentData,userId:req.body.userId, phone:req.body.phone,amount:req.body.amount}
  const phone = req.body.phone; 
  
const phoneWithoutZero = phone.substring(1);// removing the 0 from the number  0712345678
console.log(phoneWithoutZero); 

  amount = req.body.amount;
  const token = req.token;
  // res.json({ phone, amount });
  console.log({token});
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
  console.log({shortCode,passKey})
  const Url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"; // where to send the stk push request

const api="https://backendmobilewallet.onrender.com/api/deposit/call_back" //call back url after deploying it

// const api =`${ngrokUrl}/api/deposit/call_back`; //the call back url using ngrok ..Dint work with this

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
    PartyA: `254${phoneWithoutZero}`, //USERS PHONE NUMBER
    PartyB: shortCode, // OUR PAY BILL
    PhoneNumber: `254${phoneWithoutZero}`, //USERS PHONE NUMBER
    CallBackURL: api, //call back url
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
     
      res.status(200).json({res:response.data});

    })
    .catch((err) => {
      console.error(err + "hhhh");
      res.status(400).json(JSON.stringify(err) + "hhhh");
    });
};
//call back function
const callBack = async (req, res) => {

 const callBackData = req.body;
 
  console.log(callBackData);
  console.log("message");//testing if callback is called

  try {
   
    console.log(paymentData);
    console.log(callBackData);
   
    const { Body } = callBackData;
    const { stkCallback } = Body;
    if(!callBackData.Body.stkCallback.CallbackMetadata){
      console.log( "error",callBackData.Body.stkCallback.ResultDesc);
     return res.status(400).json({message:callBackData.Body.stkCallback.ResultDesc});
  }else{

    console.log(stkCallback.CallbackMetadata);

    const amount = stkCallback.CallbackMetadata.Item[0].Value;
    const trnx_id = stkCallback.CallbackMetadata.Item[1].Value;
    const TransactionDate = stkCallback.CallbackMetadata.Item[2].Value;
    const PhoneNumber = stkCallback.CallbackMetadata.Item[3].Value;
   
   
    paymentData={...paymentData, trnx_id,PhoneNumber,TransactionDate,amount}
    console.log(paymentData)
//saving transaction to the database
    const initialPayment = await Transactions.create(paymentData);

    if (initialPayment) {
      res.status(200).send({ message: "saved to db" });

    }

  }
   

    
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
};

module.exports = { stkPush, callBack};
  //not necessary
    // if (stkCallback.ResultCode !== 0) {
    //   return console.log(`the user cancelled the request`);
    // }