var authController = require("../controllers/authcontroller.js");
var connection = require("../config/connection/dbconnection.js");
var mapjs = require("../../public/js/mapser.js");
const pool = connection;
var events;

module.exports = function(app, passport) {
  function getConnection() {
    return pool;
  }
  app.get("/", authController.landing);
  app.get("/aboutus", authController.aboutus);
  app.get("/awards", authController.awards);
  app.get("/signup", authController.signup);
  app.get("/checkout.json", isLoggedIn, (req, res) => {
    const queryString = "SELECT * FROM events";
    getConnection().query(queryString, (err, rows, fields) => {
      if (err) {
        res.sendStatus(500);
        return;
      } else {
        console.log("We have got an info about");
        events = rows.map(row => {
          return {
            evName: row.evName,
            evInfo: row.evInfo,
            evType: row.evType,
            lng: row.lng,
            lat: row.lat
          };
        });
        console.log(events);
        // mapjs(events);
        res.json({ base: events });
      }
    });
  });
  app.get("/checkout", isLoggedIn, (req, res) => {
    res.render("mapPage", { title: "no", name: "Vladislav Krushenitskii" });
  });
  app.get("/logout", authController.logout);
  app.get("/prof", authController.prof);
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/checkout",

      failureRedirect: "/signup"
    })
  );
  app.post("/checkout", (req, res) => {
    console.log("Get name of your event: " + req.body.evName);
    console.log("Get your info: " + req.body.evInfo);
    console.log("Get your info: " + req.body.evType);
    console.log("Get lng: " + req.body.lng);
    console.log("Get lat: " + req.body.lat);

    const evName = req.body.evName;
    const evInfo = req.body.evInfo;
    const evType = req.body.evType;
    const lng = req.body.lng;
    const lat = req.body.lat;

    const queryString =
      "INSERT INTO events(evName, evInfo, evType, lng, lat) values (?,?,?,?,?)";
    getConnection().query(
      queryString,
      [evName, evInfo, evType, lng, lat],
      (err, results, fields) => {
        if (err) {
          console.log("Feild to insert a new user: " + err);
          res.sendStatus(500);
          return;
        }
        console.log("Inserted a new user with id" + results.insertedId);
      }
    );
  });
  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      successRedirect: "/checkout",

      failureRedirect: "/"
    })
  );

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect("/");
  }
};
