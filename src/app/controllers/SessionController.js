const User = require("../models/User");
//const crypto = require("crypto");
//const mailer = require("../../lib/mailer");
//const { hash } = require("bcryptjs");

module.exports = {
    loginForm(req, res) {
        return res.render("session/login");
    },

}