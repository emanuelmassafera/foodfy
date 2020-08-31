const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");
const File = require("../models/File");


module.exports = {
    /* ------ Recipes ------ */

    async index(req, res) {
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

        return res.render("admin/listing", { recipes });
    },

    async create(req, res) {
        results = await Recipe.chefSelectOptions();
        const options = results.rows;

        return res.render("admin/create", { chefOptions: options });

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

        let results = await Recipe.create(req.body);
        const recipeId = results.rows[0].id;

        const filesPromises = req.files.map(file => File.create({ ...file, recipe_id: recipeId }));
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

        return res.render("admin/show", { recipe, files });
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

        return res.render("admin/edit", { recipe, chefOptions: options, files });
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

    /* ------ Chefs ------ */

    async indexChef(req, res) {
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

        return res.render("admin/listing-chef", { chefs });

        Chef.all(function (chefs) {
            return res.render("admin/listing-chef", { chefs });
        });
    },

    createChef(req, res) {
        return res.render("admin/create-chef");
    },

    async postChef(req, res) {
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

    async showChef(req, res) {
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

        return res.render("admin/show-chef", { chef, recipes, files });
    },

    async editChef(req, res) {
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        if (!chef) return res.send("Chef not found!");

        results = await Chef.files(chef.id);
        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        return res.render("admin/edit-chef", { chef, files });
    },

    async putChef(req, res) {
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

    async deleteChef(req, res) {
        let results = await Chef.find(req.body.id);

        if (results.rows[0].total_recipes == 0) {
            await Chef.delete(req.body.id);
            return res.redirect("/admin/chefs");

        } else {
            return res.send("Chefs who have recipes cannot be deleted");

        }
    }
}