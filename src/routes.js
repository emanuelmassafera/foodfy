const express = require("express");
const routes = express.Router();
const multer = require("./app/middlewares/multer");
const website = require("./app/controllers/website");
const admin = require("./app/controllers/admin");

routes.get("/", website.home);
routes.get("/about", website.about);
routes.get("/recipes", website.recipes);
routes.get("/recipes/:id", website.recipesIndex);
routes.get("/chefs", website.chefs);

routes.get("/admin/recipes", admin.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", admin.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", admin.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", admin.edit); // Mostrar formulário de edição de receita
routes.post("/admin/recipes", multer.array("photos", 5), admin.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5), admin.put); // Editar uma receita
routes.delete("/admin/recipes", admin.delete); // Deletar uma receita

routes.get("/admin/chefs", admin.indexChef);
routes.get("/admin/chefs/create", admin.createChef);
routes.get("/admin/chefs/:id", admin.showChef);
routes.get("/admin/chefs/:id/edit", admin.editChef);
routes.post("/admin/chefs", multer.array("photos", 1), admin.postChef);
routes.put("/admin/chefs", multer.array("photos", 1), admin.putChef);
routes.delete("/admin/chefs", admin.deleteChef);

module.exports = routes;