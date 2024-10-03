const { getMultiCondition } = require("../models/Adminmodel");
const bcrypt = require("bcrypt");

module.exports = {
  getLoginPage: (req, res) => {
    const session = req.session;
    if (session.token) {
      res.redirect("/dashboard");
    } else {
      res.render("index", {
        title: "Signin SOURABH Admin Manager Accounts",
        error: req.flash("error"),
        success: req.flash("success"),
      });
    }
  },

  postLoginPage: async (req, res) => {
    const { username, password } = req.body;
    if (username != "" && password != "") {
      const data = await getMultiCondition("tbl_admin_information", [
        { user_name: `${username}` },
      ]);
      if (data) {
        const match = await bcrypt.compare(password, data[0].password);
        if (match) {
          const session = req.session;
          session.token = data[0].token;
          res.redirect("/dashboard");
        } else {
          req.flash("error", "Invalid Username and Password");
          res.redirect("/");
        }
      } else {
        req.flash("error", "Invalid Username and Password");
        res.redirect("/");
      }
    } else {
      req.flash("error", "All fields are required");
      res.redirect("/");
    }
  },

  getlogoutpage: (req, res) => {
    const session = req.session;
    if (session.token) {
      const dis = session.destroy();
      if (dis) {
        res.redirect("/");
      } else {
        console.log("error");
      }
    } else {
      res.redirect("/");
    }
  },
};
