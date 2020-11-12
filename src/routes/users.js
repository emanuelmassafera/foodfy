const express = require("express");
const routes = express.Router();

const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");

const SessionValidator = require("../app/validators/session");
const UserValidator = require("../app/validators/user");

const { isLoggedRedirectToUsers, onlyUsers } = require("../app/middlewares/session");

routes.get("/login", isLoggedRedirectToUsers, SessionController.loginForm);
routes.get("/forgot-password", SessionController.forgotPasswordForm);
routes.get("/change-password", SessionController.changePasswordForm);
routes.post("/login", SessionValidator.login, SessionController.login);
routes.post("/logout", SessionController.logout);
routes.post("/forgot-password", SessionValidator.forgot, SessionController.forgotPassword);
routes.post("/change-password", SessionValidator.change, SessionController.changePassword);

routes.get("/create", onlyUsers, UserValidator.create, UserController.registerForm);
routes.get("/", onlyUsers, UserController.list);
routes.get("/:id/edit", onlyUsers, UserValidator.edit, UserValidator.show, UserController.edit);
routes.post("/create", onlyUsers, UserValidator.create, UserValidator.post, UserController.post);
routes.put("/", onlyUsers, UserValidator.put, UserValidator.update, UserController.put);
routes.delete("/", onlyUsers, UserValidator.deleteValidator, UserController.delete);

module.exports = routes;