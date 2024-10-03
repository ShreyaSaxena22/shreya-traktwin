module.exports = {
  getDashboardPage: (req, res) => {
    const session = req.session;
    if (session.token) {
      res.render("dashboard/dashboard", {
        title: "Welcome to Admin Dashboard",
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } else {
      res.redirect("/");
    }
  },
};
