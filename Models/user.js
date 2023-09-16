const { Schema } = require("mongoose");

const userSchema = new Schema({
  name: {
    type:String
  },

  email: {
    type:String
  },
  password: {
    type:String
  },

});
const User = model("User", userSchema);
module.exports=User;