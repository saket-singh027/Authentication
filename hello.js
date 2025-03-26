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
    type: "string",

    require: true,
  },

  id: {
    type: Number,

    require: true,

    unique: true,
  },

  username: {
    type: "string",

    required: true,

    unique: true,
  },

  password: {
    type: "string",

    required: true,

    unique: true,
  },
});

app.use(passport.initialize());

const URL = mongoose.model("Task1", schema);

passport.use(
  new BasicStrategy(async (username, password, done) => {
    try {
      console.log(`credentials are: ${username} and ${password}`);

      const user = await URL.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect User name" });
      }

      // const ismatchPass = user.password === password ? true : false;

      const ismatchPass = user.comparePass(password);

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

schema.pre("save", async function (next) {
  const person = this;

  if (!person.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);

    //hash password

    const hashPassword = await bcrypt.hash(person.password, salt);

    person.password = hashPassword;

    next();
  } catch (err) {
    return next(err);
  }
});

async function detail(req, res) {
  const body = req.body;

  if (!body.name || !body.id) {
    return res.status(404).json({ error: "Field is Missing" });
  }

  try {
    await URL.create({
      name: body.name,

      id: body.id,

      username: body.username,

      password: body.password,
    });

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

async function del(req, res) {
  const id = req.params.id;

  try {
    const delData = await URL.deleteOne({ id: id });

    if (delData) {
      res.status(200).json(delData);
    } else {
      res.status(401).json({ msg: "Data not found" });
    }
  } catch (err) {
    res.status(404).json({ msg: err });
  }
}

schema.method.comparePass = async function (candidatePassword) {
  try {
    const match = bcrypt.compare(candidatePassword, this.password);

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

app.delete("/delete/:id", del);

// app.put("/update/:id", updatePut);

// app.patch("/update/:id", updatePatch);

app.listen(4001, console.log("server is listening"));
