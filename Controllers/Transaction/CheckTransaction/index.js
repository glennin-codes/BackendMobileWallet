const { Transactions } = require("../../../Models/transactions");
const { where } = require("../../../Models/user");
const depositFunds = require("../deposit/depositFunds");

// Controller to verify a payment for a specific userId within a time frame
const verifyTransaction = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.userId;
    console.log(userId);
    
  
    const timeThreshold = 60 * 60 * 1000; 
    const currentTime = Date.now();
    const earliestTime = currentTime - timeThreshold; // Calculate the earliest time
    
    // Query the database for payments made by the specified userId within the time frame
  const payment=await Transactions.findOne({userId : userId})
    console.log(payment.trnx_id);
  if (payment ) {

    const user = await depositFunds(userId, payment.amount);
    // Payment was found within the time frame
    return res.status(200).json({ success: true, message: "Payment verified" });

        
    } else {
      // Payment was not found within the time frame
      return res.status(404).json({ success: false, message: "Payment not found or verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = verifyTransaction
