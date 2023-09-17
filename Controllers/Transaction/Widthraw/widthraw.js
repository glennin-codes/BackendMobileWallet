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
    InitiatorName: "testapi",

    SecurityCredential:
      "WMVdpTwDkCGJ53Z2v+BbKv4yCBYgigaAHgc3LPuK1/DBlKDS27u3GAnMqxOXyxOJjFEZsXnqpPZfLQMS57Yj+FfOZ+o8Q3svg1QqalNf9F+GU6BALrhrVPLYNLWB3S7+OXKnpQxC3tOHt21LoKA6LhrcvkeOuqURRdJv9uGatBAqJThxsnNCEhCj3pNCOA8EPPN8pE+q2ygZTKL+u1Mp+eCt9CeUiZthPO/RiqQ0iTBt98W8WLkfauEiXs3YpMcCf2OqTH+5ILaj0+xPxpvL3d9+DRu97MheNDrYb11MA++cLFKxbbJPuDCqmblfyUoiyKCm7zG5v8I1ipUlwMlw5g==",
    CommandID: "BusinessPayment",
    Amount: amount,
    PartyA:600998,
    PartyB:254708374149,
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