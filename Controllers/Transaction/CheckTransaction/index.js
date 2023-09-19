const { Transactions } = require("../../../Models/transactions");

c;
const verifyPayment = async (req, res) => {
  try {
    // Extract phone number from req.body
    const { phoneNumber } = req.body;

    // Get the current date and time
    const currentTime = new Date();

    // Calculate the time 15 minutes ago
    const fifteenMinutesAgo = new Date(currentTime - 15 * 60 * 1000);

    // Query the database to find a matching transaction
    const matchingTransaction = await Transactions.findOne({
      PhoneNumber: phoneNumber,
      datePayed: { $gte: fifteenMinutesAgo, $lte: currentTime },
    });

    // Check if a matching transaction was found
    if (matchingTransaction) {
      // Send a success response
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      // No matching transaction found
      res
        .status(404)
        .json({ message: "Payment not found or not within 15 minutes" });
    }
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { verifyPayment };
