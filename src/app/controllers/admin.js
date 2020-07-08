const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");


module.exports = {
    /* ------ Recipes ------ */

    index(req, res) {
        Recipe.all(function (recipes) {
            return res.render("admin/listing", { recipes });
        });
    },

    create(req, res) {
        Recipe.chefSelectOptions(function (options) {
            return res.render("admin/create", { chefOptions: options });
        });
    },

    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        Recipe.create(req.body, function (recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`);
        });
    },

    show(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send("Recipe not found!");

            return res.render("admin/show", { recipe });
        });
    },

    edit(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send("Recipe not found!");

            Recipe.chefSelectOptions(function (options) {
                return res.render("admin/edit", { recipe, chefOptions: options });
            });
        });
    },

    put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        Recipe.update(req.body, function () {
            return res.redirect(`/admin/recipes/${req.body.id}`);
        });
    },

    delete(req, res) {

        Recipe.delete(req.body.id, function () {
            return res.redirect("/admin/recipes");
        });
    },

    /* ------ Chefs ------ */

    indexChef(req, res) {

        Chef.all(function (chefs) {
            return res.render("admin/listing-chef", { chefs });
        });
    },

    createChef(req, res) {
        return res.render("admin/create-chef");
    },

    postChef(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        Chef.create(req.body, function (chef) {
            return res.redirect(`/admin/chefs/${chef.id}`);
        });
    },

    showChef(req, res) {
        Chef.find(req.params.id, function (chef) {
            if (!chef) return res.send("Chef not found!");

            Chef.findRecipes(req.params.id, function (recipes) {
                return res.render("admin/show-chef", { chef, recipes });

            });
        });
    },

    editChef(req, res) {
        Chef.find(req.params.id, function (chef) {
            if (!chef) return res.send("Chef not found!");

            return res.render("admin/edit-chef", { chef });
        });
    },

    putChef(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        Chef.update(req.body, function () {
            return res.redirect(`/admin/chefs/${req.body.id}`);
        });
    },

    deleteChef(req, res) {
        Chef.find(req.body.id, function (chef) {
            if (chef.total_recipes == 0) {
                Chef.delete(req.body.id, function () {
                    return res.redirect("/admin/chefs");
                });
            } else {
                return res.send("Chefs who have recipes cannot be deleted");
            }
        });
    },

}