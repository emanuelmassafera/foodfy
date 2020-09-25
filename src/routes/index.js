const express = require("express");
const routes = express.Router();

const publicSection = require("./publicSection");
const privateSection = require("./privateSection");

routes.use("/", publicSection);
routes.use("/admin", privateSection);

routes.get("/admin", function(req, res) {
    return res.redirect("/admin/users/login");
});

module.exports = routes;