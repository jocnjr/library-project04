const express = require("express");
const authRoutes = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const { username, password, email, role } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        email,
        role
      });

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "2380b9229d71b6",
              pass: "7ec3778f943783"
            }
          });

          transport.sendMail({
            from: '"Library Project 👻" <ecd4198890-50f918@inbox.mailtrap.io>',
            to: email,
            subject: `Welcome, ${username}`,
            text: `Welcome, text!`,
            html: '<b>Awesome Message in html!</b>'
          })
            .then(info => {
              console.log(info)
              res.redirect("/books");
            })
            .catch(error => console.log(error))
        }
      });
    })
    .catch(error => {
      next(error)
    })
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/books",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

authRoutes.get("/slack", passport.authenticate("slack"));

authRoutes.get("/slack/callback", passport.authenticate("slack", {
  successRedirect: "/books",
  failureRedirect: "/auth/login"
}));

authRoutes.get("/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/auth/login",
  successRedirect: "/books"
}));

module.exports = authRoutes;