// const User = require('./models/User'); // Import your User model

// // Function to deposit funds into a user's wallet
// async function depositFunds(userId, amount) {
//   try {
//     // Find the user by their ID
//     const user = await User.findOne({email:email})

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Update the user's wallet balance by adding the deposited amount
//     user.amount += amount;

//     // Save the updated user document to the database
//     await user.save();

//     return user;
//   } catch (error) {
//     throw new Error('Deposit failed: ' + error.message);
//   }
// }

// // Function to withdraw funds from a user's wallet
// async function withdrawFunds(userId, amount) {
//   try {
//     // Find the user by their ID
//     const user = await User.findById(userId);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Check if the user has sufficient funds
//     if (user.amount < amount) {
//       throw new Error('Insufficient balance');
//     }

//     // Update the user's wallet balance by subtracting the withdrawn amount
//     user.amount -= amount;

//     // Save the updated user document to the database
//     await user.save();

//     return user;
//   } catch (error) {
//     throw new Error('Withdrawal failed: ' + error.message);
//   }
// }

// module.exports = { depositFunds, withdrawFunds };
