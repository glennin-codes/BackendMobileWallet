const User = require("./Models/user");

const Populate = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    if (result) {
      console.log(
        `Deleted ${result.deletedCount} documents from the User collection.`
      );
      res.send("deleted");
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports = Populate;
