const express = require("express");
const { callBack, stkPush } = require("../Controllers/Transaction/deposit/StkPush");
const CreateToken = require("../Controllers/Transaction/deposit/middleware/CreateToken");
const router=express.Router();

router.post("/",CreateToken,stkPush)

router.post('/callback',callBack);

module.exports=router