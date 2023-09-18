const User = require("../../../Models/user");

// Function to withdraw funds from a user's wallet
async function withdrawFunds(userId, amount) {
  try {
    // Find the user by their ID
    const user = await User.findOne({_id:userId });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user has sufficient funds
    if (user.amount < amount) {
      throw new Error('Insufficient balance');
    }

    // Update the user's wallet balance by subtracting the withdrawn amount
    user.amount -= amount;

    // Save the updated user document to the database
    await user.save();

    return user;
  } catch (error) {
    throw new Error('Withdrawal failed: ' + error.message);
  }
}
module.exports=withdrawFunds