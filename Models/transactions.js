const { Schema, default: mongoose } = require("mongoose");

const transactionSchema = new Schema({
 email:{
type:String
 },

  datePayed: {
    type: Date,
    default: Date.now(),
  },

  phone: {
    type: String,
  },
  amount: {
    type: String,
  },
  trnx_id: {
    type: String,
  },
  merchantRequestId: {
    type: String,
  },
});

const Transactions = mongoose.model("payments", transactionSchema);

module.exports = { Transactions };
