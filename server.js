var express = require("express");
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var env = require("dotenv").load();
var app = express();

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
); // session secret

//Models
var models = require("./app/models");

app.use(passport.initialize());

app.use(passport.session()); // persistent login sessionsvar app = express();

app.get("/", function(req, res) {
  res.send("Welcome to Passport with Sequelize");
});

//Sync Database
models.sequelize
  .sync()
  .then(function() {
    console.log("Nice! Database looks fine");
  })
  .catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
  });
app.listen(3000, function(err) {
  if (!err) console.log("Site is live");
  else console.log(err);
});
