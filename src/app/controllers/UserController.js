const User = require("../models/User");

module.exports = {
    registerForm(req, res) {
        return res.render("user/register", { session: req.session});
    },

    async post(req, res) {
        const userId = await User.create(req.body);

        return res.redirect("/admin/users/list");
    },

    async list(req, res) {
        let results = await User.all();
        const users = results.rows;

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        return res.render("user/list", { users, session: req.session, sessionIsAdmin });
    },

    async delete(req, res) {

        await User.delete(req.body.id);
        
        return res.redirect("/admin/users/list");
    },

    async edit(req, res) {
        let results = await User.find(req.params.id);
        const user = results.rows[0];

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        return res.render("user/edit", { user, session: req.session, sessionIsAdmin })
    }
}