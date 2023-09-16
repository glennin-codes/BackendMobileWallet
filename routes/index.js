const express = require("express");
const { CreateToken, callBack } = require("../Controllers/StkPush");
const router=express.Router();

router.post("/",CreateToken,stkPush)

router.post('/callback',callBack);

module.exports=router