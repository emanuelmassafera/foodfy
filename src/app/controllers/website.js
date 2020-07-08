const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

module.exports = {
    home(req, res) {
        let { filter } = req.query;

        Recipe.findBy(filter, function (recipes) {
            return res.render("website/home", { recipes, filter });
        });
    },

    about(req, res) {
        return res.render("website/about");
    },

    recipes(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 3;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {

                if (recipes[0]) {
                    const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page
                    };

                    return res.render("website/recipes", { recipes, pagination, filter });
                } else {
                    return res.render("website/recipes", { recipes, filter });
                }

            }
        };

        Recipe.paginate(params);
    },

    recipesIndex(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send("Recipe not found!");

            return res.render("website/specification", { recipe });
        });
    },

    chefs(req, res) {
        Chef.all(function (chefs) {
            return res.render("website/chefs", { chefs });
        });
    }
}