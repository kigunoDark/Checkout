var express = require("express");
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var env = require("dotenv").load();
var exphbs = require("express-handlebars");
var app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

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

//Routes
var authRoute = require("./app/routes/auth.js")(app, passport);

//load passport strategies
require("./app/config/passport/passport.js")(passport, models.user);

//For Handlebars
app.set("views", "./views");
app.engine("hbs", exphbs({ extname: ".hbs", defaultLayout: "layout" }));
app.set("view engine", ".hbs");

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
