const express = require("express");
const { callBack, stkPush } = require("../Controllers/Transaction/deposit/StkPush");
const CreateToken = require("../Controllers/Transaction/deposit/middleware/CreateToken");
const router=express.Router();

router.get('/',(req,res)=>{
    res.send("api working succesful!")
  })
router.post("/api/deposit",CreateToken,stkPush)

router.post('/api/deposit/callback',callBack);

  router.post('/verifyCode',verifyCode);
  router.post('/auth/signup',registerOwner)
  router.post('/auth/login',loginUser);

module.exports=router