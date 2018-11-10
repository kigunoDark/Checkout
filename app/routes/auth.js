var authController = require("../controllers/authcontroller.js");

module.exports = function(app, passport) {
  app.get("/", authController.landing);
  app.get("/aboutus", authController.aboutus);
  app.get("/signup", authController.signup);
  // app.get("/signin", authController.signin);
  app.get("/checkout", isLoggedIn, authController.mainmap);
  app.get("/logout", authController.logout);
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/checkout",

      failureRedirect: "/signup"
    })
  );

  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      successRedirect: "/checkout",

      failureRedirect: "/"
    })
  );

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect("/signin");
  }
};
