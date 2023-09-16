const { Transactions } = require("../../../Models/transactions");

const getAllTransactions=async(req,res)=>{
   try{
      const AllTransactions=await Transactions.find();
      console.log("all payees",AllTransactions);
      res.status(200).json(AllTransactions);
    
   }catch(e){
    console.error(e.message);
    res.status(500).send("server error")
   }
}
module.exports=getAllTransactions;