var express = require("express");
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");
var app = express();

if (!fs.existsSync("./users")) {
  fs.mkdirSync("./users");
}

const usersFilePath = "./users/users.json";
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, "{}", "utf8");
}

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

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/logout", (req, res) => {
  if (req.session.username) {
    console.log("User " + req.session.username + " logged out.");
    req.session.destroy();
  }
  res.redirect("/");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const user = getUser(fields.username[0], fields.password[0]);
    if (user) {
      req.session.username = user;
      res.status(200).json({ message: "Login successful" });
      console.log("User " + fields.username[0] + " logged in.");
    } else {
      res.status(401).json({
        message: "Incorrect username or password",
      });
    }
  });
});

function getUser(username, password) {
  const data = fs.readFileSync("./users/users.json");
  const json = JSON.parse(data);
  if (json[username] == password) {
    return username;
  } else return false;
}

app.post("/register", function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const data = verifyUsername(fields.username);
    if (data) {
      data[fields.username[0]] = fields.password[0];
      fs.writeFileSync("./users/users.json", JSON.stringify(data));
      res.status(200).json({
        message: "Registration successful",
      });
    } else
      res.status(409).json({
        message: "Username already exists. Please choose a different username",
      });
  });
});

function verifyUsername(username) {
  const data = fs.readFileSync("./users/users.json");
  const json = JSON.parse(data);
  if (json[username] !== undefined) {
    return false;
  }
  return json;
}

app.get("/register", function (req, res) {
  res.render("register");
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(5000);
