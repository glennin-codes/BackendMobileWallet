// Assuming the path to your user model file

const User = require("../../Models/user");

const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you pass the user ID as a parameter in the URL

    const user = await User.findById(userId).select("-password"); // Exclude the 'password' field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getSingleUser;
