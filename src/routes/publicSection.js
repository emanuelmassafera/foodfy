const express = require("express");
const routes = express.Router();

const PublicSectionController = require("../app/controllers/PublicSectionController");

routes.get("/", PublicSectionController.home);
routes.get("/about", PublicSectionController.about);
routes.get("/recipes", PublicSectionController.recipes);
routes.get("/recipes/:id", PublicSectionController.specificRecipe);
routes.get("/chefs", PublicSectionController.chefs);

module.exports = routes;