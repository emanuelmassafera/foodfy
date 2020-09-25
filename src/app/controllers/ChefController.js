const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");
const File = require("../models/File");
const User = require("../models/User");

module.exports = {
    async list(req, res) {
        let results = await Chef.all();
        let chefs = results.rows;

        for (let index = 0; index < chefs.length; index++) {
            results = await Chef.files(chefs[index].id);
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }));

            if(files[0]) {
                chefs[index].image = files[0].src;
            } else {
                chefs[index].image = "//placehold.it/500x360";
            }
        }

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        return res.render("private-access/chef/list", { chefs, session: req.session, sessionIsAdmin });
    },

    create(req, res) {
        return res.render("private-access/chef/create", { session: req.session });
    },

    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        if (req.files.length == 0) {
            return res.send("Select at least one image!");
        }

        const filesPromises = req.files.map(file => File.createChefFile({ ...file }));
        let results = await filesPromises[0];
        const fileId = results.rows[0].id;

        results = await Chef.create(req.body, fileId);
        const chefId = results.rows[0].id;

        return res.redirect(`/admin/chefs/${chefId}`);

    },

    async show(req, res) {
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        if (!chef) return res.send("Chef not found!");

        results = await Chef.findRecipes(chef.id);
        let recipes = results.rows;

        for (let index = 0; index < recipes.length; index++) {
            results = await Recipe.files(recipes[index].id);
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }));

            if(files[0]) {
                recipes[index].image = files[0].src;
            } else {
                recipes[index].image = "//placehold.it/500x360";
            }
        }

        results = await Chef.files(chef.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        return res.render("private-access/chef/show", { chef, recipes, files, session: req.session, sessionIsAdmin });
    },

    async edit(req, res) {
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        if (!chef) return res.send("Chef not found!");

        results = await Chef.files(chef.id);
        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        return res.render("private-access/chef/edit", { chef, files, session: req.session });
    },

    async put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Please, fill all fields!");
            }
        }

        let results = await Chef.files(req.body.id);
        let fileId = results.rows[0].id;

        if (req.files.length != 0) {
            const filesPromises = req.files.map(file => File.createChefFile({ ...file }));
            results = await filesPromises[0];
            fileId = results.rows[0].id;
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromises = removedFiles.map(id => File.delete(id));

            await Promise.all(removedFilesPromises);
        }

        await Chef.update(req.body, fileId);

        return res.redirect(`/admin/chefs/${req.body.id}`);
    },

    async delete(req, res) {
        let results = await Chef.find(req.body.id);

        if (results.rows[0].total_recipes == 0) {
            await Chef.delete(req.body.id);
            return res.redirect("/admin/chefs");

        } else {
            return res.send("Chefs who have recipes cannot be deleted");

        }
    }
}