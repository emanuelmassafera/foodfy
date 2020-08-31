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
        let results = await User.all();
        const users = results.rows;

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        console.log(sessionIsAdmin)

        return res.render("user/list", { users, session: req.session, sessionIsAdmin });
    },
}