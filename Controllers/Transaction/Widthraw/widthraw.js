const { default: axios } = require("axios");
const { startNgrok } = require("../../../ngrok");

const widthrawPayment = async (req, res) => {
    const ngrokUrl = await startNgrok();
const {amount,email}=req.body

const phone = req.body.phone.substring(1); // removing the 0 from the number
  console.log(req.body);

  const Url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest"; 
const token=req.token
  const Data = {
    OriginatorConversationID: "bb7694e3-aacb-46e2-84d8-c6be3813a022",
    InitiatorName: "testapiglen",
    SecurityCredential:
      "GcnPEjRZc3kYQDYMEQL5EF8wBYX13X2Ttl5zWhrx8dttAw89FtV8MViM87lGldpSi9JHDRsOvrUzNeaaEmPYCh1E7EYVfeS/NkSZV0lim6wvEPn/tojZdh/CjLWx70S6LTLO6g5NX5prXb6jSLfl1wNmTX6kki5Q/+gHb61N2e4EpG0nTe8zJd0/gK7qqKJENZHslX9ZzJUsJb0JTkBZl0qk5Q0+NdeYW8tD2SbyCi9KEcQtiyeYrBScOUuIWRGyLHAFO76GyCVmeQogPSdWlteboBv99QOIEl3gwgogW8JFPEoGwk0dcs1IGO0IQBiFVH6FFnfzgrYDeQMNmIro0A==",
    CommandID: "BusinessPayment",
    Amount: amount,
    PartyA:600987,
    PartyB:"254708374149",
    Remarks: "widthraw funds",
    QueueTimeOutURL: `${ngrokUrl}/api/widthraw/quee`,
    ResultURL:`${ngrokUrl}/api/widthraw/result`,
    Occassion: "funds",
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
     
   
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.error(err + "hhhh");
      res.status(400).json(JSON.stringify(err) + "hhhh");
    });
};
const quee=(req,res)=>{
    console.log(req.body)
}
const result=(req,res)=>{
    console.log(req.body)
}
module.exports={widthrawPayment,quee,result}