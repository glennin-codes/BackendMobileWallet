const express = require("express");
const {
  callBack,
  stkPush,
  getcallBackData,
} = require("../Controllers/Transaction/deposit/StkPush");
const CreateToken = require("../Controllers/Transaction/deposit/middleware/CreateToken");
const loginUser = require("../Controllers/Auth/Login");
const CreateUSer = require("../Controllers/Auth/SignUp");
const Populate = require("../populate");
const getAllTransactions = require("../Controllers/Transaction/GetTransaction");
const { quee, widthrawPayment, result } = require("../Controllers/Transaction/Widthraw/widthraw");
const getSingleUser = require("../Controllers/GetUser");
const verifyTransaction = require("../Controllers/Transaction/CheckTransaction");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("api working succesful!");
});

router.post("/deposit", CreateToken, stkPush);
router.post("/deposit/call_back", callBack);
// router.get("/deposit/call_back/data", getcallBack);
router.post("/deposit/check",verifyTransaction );
router.post("/widthraw", CreateToken, widthrawPayment);
router.post("/widthraw/quee",quee);
router.post("/widthraw/result",result);
router.get("/user/getuser/:id",getSingleUser)
router.get("/transactions")
router.route("/auth/login").post(loginUser);
router.route("/auth/signup").post(CreateUSer);
router.delete("/api/all", Populate);
router.get("/transactions", getAllTransactions);
module.exports = router;
