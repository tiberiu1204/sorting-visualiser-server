var express = require("express");
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");
var app = express();

app.set("view engine", "ejs");

const session = require("express-session");
app.use(
  session({
    secret: "OrpheanBeholderScryDoubt",
    resave: true,
    saveUninitialized: false,
  }),
);

app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "scripts")));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/logout", (req, res) => {
  if (req.session.username) {
    req.session.destroy();
  }
  res.redirect("/");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(5000);
