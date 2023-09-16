const express = require("express");
const { callBack, stkPush } = require("../Controllers/Transaction/deposit/StkPush");
const CreateToken = require("../Controllers/Transaction/deposit/middleware/CreateToken");
const loginUser = require("../Controllers/Auth/Login");
const CreateUSer = require("../Controllers/Auth/SignUp");
const router=express.Router();

router.get('/',(req,res)=>{
    res.send("api working succesful!")
  })

router.post("/api/deposit",CreateToken,stkPush)

router.post('/api/deposit/callback',callBack);
router.route('/api/auth/login').post(loginUser);
router.route('/api/auth/signup').post(CreateUSer)

module.exports=router