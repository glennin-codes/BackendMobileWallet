const { default: mongoose } = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },
  password: {
    type: String,
  },
  amount: {
    type: Number,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
