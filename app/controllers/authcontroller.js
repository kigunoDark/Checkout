var exports = (module.exports = {});
exports.landing = (req, res) => {
  res.render("landingPage");
};
exports.signup = function(req, res) {
  res.render("signUpPage");
};

exports.signin = function(req, res) {
  res.render("signInPage");
};

exports.mainmap = function(req, res) {
  res.render("mapPage", { title: "no", firstname: req.get("firstname") });
};

exports.aboutus = (req, res) => {
  res.render("aboutUsPage");
};
exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/");
  });
};
