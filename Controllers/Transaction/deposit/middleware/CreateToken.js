const { default: axios } = require("axios");

const CreateToken = async (req, res, next) => {
  //getting the  auth ..by encoding both consumer key and consumerSecret

  const secret = process.env.MPESA_CONSUMER_SECRET;
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  //AUTH
  const auth = new Buffer.from(`${consumerKey}:${secret}`).toString("base64"); // this encodes the consume secret and consumer key using base64. the encoded string will be used to send a request to the safaricom api to give us an access token

  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((data) => {
      console.log(data.data.access_token);
      token = data.data.access_token;
      next(); //passing the token to the next middleware
    })
    .catch((err) => {
      console.log(err.response);
    });
};

module.exports = CreateToken;
