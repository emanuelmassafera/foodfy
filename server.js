const express = require("express");
const nunjucks = require("nunjucks");

const server = express();
const recipes = require("./data");

server.use(express.static("public"));

server.set("view engine", "njk");

nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
});

server.get("/", function (req, res) {
    return res.render("home", { recipes });
});

server.get("/about", function (req, res) {
    return res.render("about");
});

server.get("/recipes", function (req, res) {
    return res.render("recipes", { recipes });
});

server.get("/recipes/:index", function (req, res) {
    const route = req.params.index;
    const recipeIndex = route.substring(1);
    
    return res.render("specification", { recipe: recipes[recipeIndex]});
});

server.listen(5001, function () {
    console.log("Server is running");
});