var exports = (module.exports = {});

exports.signup = function(req, res) {
  res.render("signUpPage");
};

exports.signin = function(req, res) {
  res.render("signInPage");
};

exports.mainmap = function(req, res) {
  res.render("mapPage");
};

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/");
  });
};
