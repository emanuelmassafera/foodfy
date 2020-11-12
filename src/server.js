const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const methodOverride = require("method-override");   // Permite usar post, put e delete
const session = require("./config/session");

const server = express();

server.use(session);
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));  // Permite usar o req.body
server.use(methodOverride("_method"));
server.use(routes);
server.get('*', function(req, res){
    res.status(404).render("not-found/not-found");
});

server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
});

server.listen(5001, function () {
    console.log("Server is running");
});