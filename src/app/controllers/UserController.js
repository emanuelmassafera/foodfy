const User = require("../models/User");

module.exports = {
    registerForm(req, res) {
        return res.render("user/register");
    },

    async post(req, res) {
        const userId = await User.create(req.body);

        req.session.userId = userId;

        return res.redirect("/admin/users/list", { session: req.session});
    },

    async list(req, res) {
        const results = await User.all();
        const users = results.rows;

        return res.render("user/list", { users, session: req.session});
    },
}