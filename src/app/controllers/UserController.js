const User = require("../models/User");

module.exports = {
    registerForm(req, res) {
        return res.render("private-access/user/create", { session: req.session});
    },

    async post(req, res) {
        const userId = await User.create(req.body);

        return res.redirect("/admin/users");
    },

    async list(req, res) {
        let results = await User.all();
        const users = results.rows;

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        return res.render("private-access/user/list", { users, session: req.session, sessionIsAdmin });
    },

    async delete(req, res) {

        await User.delete(req.body.id);
        
        return res.redirect("/admin/users");
    },

    async edit(req, res) {
        let results = await User.find(req.params.id);
        const user = results.rows[0];

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        return res.render("private-access/user/edit", { user, session: req.session, sessionIsAdmin })
    },

    async put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "isAdmin") {
                return res.send("Please, fill all fields!");
            }
        }

        await User.update(req.body);

        return res.redirect(`/admin/users`);
    }
}