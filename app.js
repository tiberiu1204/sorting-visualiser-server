var express = require("express");
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");
var app = express();

app.set("view engine", "ejs");

const session = require("express-session");
app.use(
  session({
    secret: "abcdefg",
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
  res.render("about/about");
});

app.listen(5000);
