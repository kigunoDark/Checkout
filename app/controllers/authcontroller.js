var exports = (module.exports = {});
exports.landing = (req, res) => {
  res.render("landingPage");
};
exports.signup = function(req, res) {
  res.render("signUpPage");
};

exports.awards = function(req, res) {
  res.render("awardsPage", { title: "no" });
};

exports.signin = function(req, res) {
  res.render("signInPage");
};

// exports.mainmap = function(req, res) {
//   res.render("mapPage", { title: "no", name: "Vladislav Krushenitskii" });
// };

exports.aboutus = (req, res) => {
  res.render("aboutUsPage");
};
exports.prof = (req, res) => {
  res.render("profilePage", { title: "no" });
};
exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/");
  });
};
