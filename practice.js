const mongoose = require("mongoose");
const BasicStrategy = require("passport-http").BasicStrategy;
const express = require("express");
const passport = require("passport");
const app=express();


app.use(express.json());
app.use(passport.initialize());

const schema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const dbSetter = mongoose.model("practice-passport", schema);

// async function getData(req, res) {
//   const body = req.body;
//   if (!body.name || !body.id || body.username || body.password) {
//     res.status(404).json({ msg: "field is missing" });

//   }

//   try {
//     const data=await dbSetter.find();
//     console.log("Data has been sent");
//     res.status(200).json(data)
    
//   } catch (err) {
//     res.status(400).json({msg:"Data is not been sent"});
//   }
// }

// passport.use(new BasicStrategy(async(username,password,done)=>{
//     try{
//         const user=await dbSetter.find({username:username});
//         if(!user)
//         {
//             return done(null,false,{message:"Incorrect username"});
//         }
//         const pass=user.password===password?true:false;

//         if(pass)
//         {
//             return done(null,user,{msg:"Successfully signed in"});
//         }
//         else{
//             return done(null,false,{msg:"incorrect pass"});
//         }
//     }
//     catch(err){
//         res.status(404).json({msg:"error"});
//     }
// }))

// passport.use(new BasicStrategy(async (username,password,done)=>{
//   try{
//     const user=await dbSetter.findOne({username:username});

//     if(!user)
//     {
//       return done(null,false,{msg:"user not found"});
//     }
//     else
//     {
//       const pass=user.password===password?true:false;

//       if(pass)
//       {
//          return done (null,user,{msg:"successfully signed in"});
//       }
//       else{
//           return done(null,false,{msg:"Incorrect password"});
//       }
//     }
//   }
//   catch(err){
//     throw err;
//   }
// }))


// Hashing practice

// schema.pre("save",async function (next) {
  
//   const person=this;

//   try{
//     const salt=bcrypt.genSalt(10);

//     const hashpass=bcrypt.hash(person.password,salt);
//     person.password=hashpass;
//     next();
//   }
//   catch(err)
//   {
//     return next(err);
//   }
// })

// schema.pre("save" , async function (next) {
//         const salt =await bcrypt.salt(10);
//         const hashpass=await bcrypt.hash(this.password,salt);
//         next();
// })


// passport.use("save",new BasicStrategy(async(username,password,done)=>{
//   try{
//       const user=dbSetter.findOne({username:username});

//       if(!user)
//       {
//         return done(null,false,{msg:"username not found"});
//       }
//       else
//       {
//           const pass=await dbSetter.password===password?true:false;

//           if(pass)return done(null,user);
//           else
//           return done(null,false,{msg:'invalid'});
//       }
//   }
//   catch(err)
//   {
//     return done(err);
//   }
// }))


schema.
app.get("/",passport.authenticate("basic",{session:false}),getData);

app.listen(3000, () => {
  console.log("server is listening");
});
