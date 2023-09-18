
const User = require("../../Models/user");
const jwt=require ('jsonwebtoken');
const bcrypt= require('bcrypt');

const generateAuthToken = (userId, email,phone) => {
  return jwt.sign({ userId: userId, email: email,phone:phone}, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const CreateUSer = async (req, res) => {
  try {
 
      const { name, email, password, phone } =
        req.body;

      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
    //   const verificationCode = Math.floor(Math.random() * 900000) + 100000;

      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        amount:0,
        phone:phone
     
        // verificationCode: verificationCode,
      });

      await user.save();

      const token = generateAuthToken(user._id, user.email,user.phone);



 res.status(201).json({token:token,user:user});
   
     } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports=CreateUSer;