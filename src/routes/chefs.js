const express = require("express");
const routes = express.Router();
const multer = require("../app/middlewares/multer");

const ChefController = require("../app/controllers/ChefController");
const { onlyUsers } = require("../app/middlewares/session");
const ChefValidator = require("../app/validators/chef");

routes.get("/", onlyUsers, ChefController.list);
routes.get("/create", onlyUsers, ChefValidator.onlyAdmin, ChefController.create);
routes.get("/:id", onlyUsers, ChefController.show);
routes.get("/:id/edit", onlyUsers, ChefValidator.onlyAdmin, ChefController.edit);
routes.post("/", onlyUsers, multer.array("photos", 1), ChefValidator.onlyAdmin, ChefController.post);
routes.put("/", onlyUsers, multer.array("photos", 1), ChefValidator.onlyAdmin, ChefController.put);
routes.delete("/", onlyUsers, ChefValidator.onlyAdmin, ChefController.delete);

module.exports = routes;