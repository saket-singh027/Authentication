const { testUserController } = require("../controller/testController");

const express=require(express);

const router=express.Router();

router.get("/test-user",testUserController);

module.exports=router;