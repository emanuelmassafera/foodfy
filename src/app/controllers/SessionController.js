const User = require("../models/User");
//const crypto = require("crypto");
//const mailer = require("../../lib/mailer");
//const { hash } = require("bcryptjs");

module.exports = {
    loginForm(req, res) {
        return res.render("session/login");
    },

    login(req, res) {
        req.session.userId = req.user.id;

        return res.redirect("/admin/recipes");
    },

    logout(req, res) {
        req.session.destroy();

        return res.redirect("/admin/recipes");
    },
}