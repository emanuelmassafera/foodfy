const data = require("../../../data.json");
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
        let { filter } = req.query;

        Recipe.findBy(filter, function (recipes) {
            return res.render("website/recipes", { recipes, filter });
        });
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