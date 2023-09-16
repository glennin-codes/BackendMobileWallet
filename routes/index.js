const express = require("express");
const { CreateToken, callBack, stkPush } = require("../Controllers/StkPush");
const router=express.Router();

router.post("/",CreateToken,stkPush)

router.post('/callback',callBack);

module.exports=router