const bcrypt = require("bcrypt");

const User = require("../../Models/user");
const jwt = require("jsonwebtoken");

const generateAuthToken = (userId, email) => {
  return jwt.sign({ userId: userId, email: email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const loginUser = async (req, res) => {
  try {
    // Manual Sign-in
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateAuthToken(user._id, user.email, user.name);

    res.status(200).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = loginUser;