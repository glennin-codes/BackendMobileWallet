
const User = require("../../Models/user");
const jwt=require ('jsonwebtoken');

const generateAuthToken = (userId, email,name) => {
  return jwt.sign({ userId: userId, email: email,UserName:name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const createUSer = async (req, res) => {
  try {
 
      const { name, email, password,  } =
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
        amount:0
     
        // verificationCode: verificationCode,
      });

      await user.save();

      const token = generateAuthToken(user._id, user.email,user.name);

    //   const verify = {
    //     email: user.email,
    //     name: user.name,
    //     code: verificationCode,
    //   };

    //   VerifyEmail(verify);

   return res.status(201).json(token);
     } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports=createUSer;