const mongoose = require("mongoose");
const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const BasicStrategy = require("passport-http").BasicStrategy;
const bcrypt = require("bcryptjs");

app.use(express.json());

mongoose.set("strictQuery", true);
app.use(router);

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

app.use(passport.initialize());

// Pre-save middleware to hash the password
schema.pre("save", async function (next) {
  const person = this;
  console.log("Pre-save middleware triggered"); // Debugging
  console.log("Password modified:", person.isModified("password")); // Debugging

  if (!person.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    console.log("Salt generated:", salt); // Debugging
    const hashPassword = await bcrypt.hash(person.password, salt); // Hash the password
    console.log("Hashed Password:", hashPassword); // Debugging
    person.password = hashPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

const URL = mongoose.model("Task1", schema);

passport.use(
  new BasicStrategy(async (username, password, done) => {
    try {
      console.log(`credentials are: ${username} and ${password}`);
      const user = await URL.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect User name" });
      }

      const ismatchPass = await user.comparePass(password); // Await the comparison

      if (ismatchPass) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect Password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

async function detail(req, res) {
  const body = req.body;
  console.log("Request body:", body); // Debugging

  if (!body.name || !body.id || !body.username || !body.password) {
    return res.status(404).json({ error: "Field is Missing" });
  }

  try {
    const newUser = new URL({
      name: body.name,
      id: body.id,
      username: body.username,
      password: body.password, // This will trigger the pre("save") middleware
    });
    await newUser.save(); // Use .save() to trigger the middleware
    console.log("User saved successfully:", newUser); // Debugging
    return res.status(200).json({ msg: "data stored" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

async function getData(req, res) {
  try {
    const data = await URL.find({});
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: err });
  }
}

async function updatePut(req, res) {
  const id = req.params.id;
  const body = req.body;
  try {
    const updatedData = await URL.findOneAndUpdate({ id: id }, body, {
      new: true,
      runValidators: true,
    });
    if (updatedData) {
      res.status(200).json(updatedData);
    } else {
      res.status(404).json({ msg: "Data not found" });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function updatePatch(req, res) {
  const id = req.params.id;
  const body = req.body;
  try {
    const updatedData = await URL.findOneAndUpdate({ id: id }, body, {
      new: true,
      runValidators: true,
    });
    if (updatedData) {
      res.status(200).json(updatedData);
    } else {
      res.status(404).json({ msg: "Data not found" });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

schema.methods.comparePass = async function (candidatePassword) {
  try {
    console.log("Comparing password:", candidatePassword, this.password); // Debugging
    const match = await bcrypt.compare(candidatePassword, this.password);
    return match;
  } catch (err) {
    throw err;
  }
};

mongoose.connect("mongodb://127.0.0.1:27017/httpmongo").then(() => {
  console.log("DB Connected Successfully");
});

app.post("/", detail);
app.get("/data", passport.authenticate("basic", { session: false }), getData);

app.listen(4001, () => {
  console.log("Server is listening on port 4001");
});
