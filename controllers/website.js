const data = require("../data.json");

// HOME
exports.home = function (req, res) {
    return res.render("website/home", { recipes: data.recipes });
}

// ABOUT
exports.about = function (req, res) {
    return res.render("website/about");
}

// RECIPES 
exports.recipes = function (req, res) {
    return res.render("website/recipes", { recipes: data.recipes });
}

// RECIPES - INDEX
exports.recipesIndex = function (req, res) {
    const route = req.params.index;
    const recipeIndex = route.substring(1);
    
    return res.render("website/specification", { recipe: data.recipes[recipeIndex]});
}