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

//  }

// module.exports = { depositFunds, withdrawFunds };
