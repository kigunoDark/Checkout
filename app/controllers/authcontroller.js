var exports = (module.exports = {});

exports.signup = function(req, res) {
  res.render("signUpPage");
};

exports.signin = function(req, res) {
  res.render("signInPage");
};
