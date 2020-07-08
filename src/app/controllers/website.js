const data = require("../../../data.json");
const Recipe = require("../models/Recipe");

module.exports = {
    home(req, res) {
        Recipe.all(function (recipes) {
            return res.render("website/home", { recipes });
        });
    },

    about(req, res) {
        return res.render("website/about");
    },

    recipes(req, res) {
        Recipe.all(function (recipes) {
            return res.render("website/recipes", { recipes });
        });
    },

    recipesIndex(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send("Recipe not found!");

            return res.render("website/specification", { recipe });
        });
    }
}