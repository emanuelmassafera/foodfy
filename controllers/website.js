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
    const { id } = req.params;
    
    const foundRecipe = data.recipes.find(function (recipe) {
        return recipe.id == id;
    });

    if (!foundRecipe) {
        return res.send("Recipe not found!");
    }

    return res.render("website/specification", { recipe: foundRecipe});
}