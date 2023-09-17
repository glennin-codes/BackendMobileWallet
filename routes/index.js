const express = require("express");
const {
  callBack,
  stkPush,
} = require("../Controllers/Transaction/deposit/StkPush");
const CreateToken = require("../Controllers/Transaction/deposit/middleware/CreateToken");
const loginUser = require("../Controllers/Auth/Login");
const CreateUSer = require("../Controllers/Auth/SignUp");
const Populate = require("../populate");
const getAllTransactions = require("../Controllers/Transaction/GetTransaction");
const { quee, widthrawPayment, result } = require("../Controllers/Transaction/Widthraw/widthraw");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("api working succesful!");
});

router.post("/deposit", CreateToken, stkPush);
router.post("/deposit/call_back", callBack);
router.post("/widthraw", CreateToken, widthrawPayment);
router.post("/widthraw/quee",quee);
router.post("/widthraw/result",result);


router.route("/auth/login").post(loginUser);
router.route("/auth/signup").post(CreateUSer);
router.delete("/api/all", Populate);
router.get("/transactions", getAllTransactions);
module.exports = router;
