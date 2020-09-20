const express = require("express");
const routes = express.Router();
const multer = require("./app/middlewares/multer");
const website = require("./app/controllers/website");
const admin = require("./app/controllers/admin");
const SessionController = require("./app/controllers/SessionController");
const UserController = require("./app/controllers/UserController");
const SessionValidator = require("./app/validators/session");
const { isLoggedRedirectToUsers, onlyUsers } = require("./app/middlewares/session")


routes.get("/", website.home);
routes.get("/about", website.about);
routes.get("/recipes", website.recipes);
routes.get("/recipes/:id", website.recipesIndex);
routes.get("/chefs", website.chefs);

routes.get("/admin/recipes", onlyUsers, admin.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", onlyUsers, admin.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", onlyUsers, admin.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", onlyUsers, admin.edit); // Mostrar formulário de edição de receita
routes.post("/admin/recipes", onlyUsers, multer.array("photos", 5), admin.post); // Cadastrar nova receita
routes.put("/admin/recipes", onlyUsers, multer.array("photos", 5), admin.put); // Editar uma receita
routes.delete("/admin/recipes", onlyUsers, admin.delete); // Deletar uma receita

routes.get("/admin/chefs", onlyUsers, admin.indexChef);
routes.get("/admin/chefs/create", onlyUsers, admin.createChef);
routes.get("/admin/chefs/:id", onlyUsers, admin.showChef);
routes.get("/admin/chefs/:id/edit", onlyUsers, admin.editChef);
routes.post("/admin/chefs", onlyUsers, multer.array("photos", 1), admin.postChef);
routes.put("/admin/chefs", onlyUsers, multer.array("photos", 1), admin.putChef);
routes.delete("/admin/chefs", onlyUsers, admin.deleteChef);

routes.get("/admin/users/login", SessionController.loginForm);
routes.post("/admin/users/login", SessionValidator.login, SessionController.login);
routes.post("/admin/users/logout", SessionController.logout);

routes.get("/admin/users/register", onlyUsers, UserController.registerForm);
routes.post("/admin/users/register", onlyUsers, UserController.post);
routes.get("/admin/users/list", onlyUsers, UserController.list);
routes.delete("/admin/users", onlyUsers, UserController.delete);
routes.get("/admin/users/:id/edit", onlyUsers, UserController.edit);
routes.put("/admin/users", onlyUsers, UserController.put);

routes.get("/admin/users/forgot-password", SessionController.forgotPasswordForm);
routes.post("/admin/users/forgot-password", SessionValidator.forgot, SessionController.forgotPassword);
routes.get("/admin/users/change-password", SessionController.changePasswordForm);
routes.post("/admin/users/change-password", SessionValidator.change, SessionController.changePassword);


module.exports = routes;