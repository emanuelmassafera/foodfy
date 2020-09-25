const Recipe = require("../models/Recipe");
const File = require("../models/File");
const User = require("../models/User");

module.exports = {
    async list(req, res) {
        let results = await Recipe.all();
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

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        return res.render("private-access/recipe/list", { recipes, session: req.session, sessionIsAdmin });
    },

    async create(req, res) {
        results = await Recipe.chefSelectOptions();
        const options = results.rows;

        return res.render("private-access/recipe/create", { chefOptions: options, session: req.session });

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

        let results = await Recipe.create(req.body, req.session.userId);
        const recipeId = results.rows[0].id;

        const filesPromises = req.files.map(file => File.create({ ...file, recipe_id: recipeId, session: req.session }));
        await Promise.all(filesPromises);

        return res.redirect(`/admin/recipes/${recipeId}`);
    },

    async show(req, res) {

        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];

        if (!recipe) return res.send("Recipe not found!");

        results = await Recipe.files(recipe.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        results = await User.isAdmin(req.session.userId);
        const sessionIsAdmin = results.rows[0];

        return res.render("private-access/recipe/show", { recipe, files, session: req.session, sessionIsAdmin });
    },

    async edit(req, res) {

        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];

        if (!recipe) return res.send("Recipe not found!");

        results = await Recipe.chefSelectOptions();
        const options = results.rows;

        results = await Recipe.files(recipe.id);
        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        return res.render("private-access/recipe/edit", { recipe, chefOptions: options, files, session: req.session });
    },

    async put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        if (req.files.length != 0) {
            const newFilesPromises = req.files.map(file => File.create({ ...file, recipe_id: req.body.id }));

            await Promise.all(newFilesPromises);
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromises = removedFiles.map(id => File.delete(id));

            await Promise.all(removedFilesPromises);
        }

        await Recipe.update(req.body);

        return res.redirect(`/admin/recipes/${req.body.id}`);

    },

    async delete(req, res) {

        await Recipe.delete(req.body.id);

        return res.redirect("/admin/recipes");
    },
}