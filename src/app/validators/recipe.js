const User = require("../models/User");
const Recipe = require("../models/Recipe");

async function edit(req, res, next) {

    let results = await Recipe.all();
    let recipes = results.rows;

    for (let index = 0; index < recipes.length; index++) {
        results = await Recipe.files(recipes[index].id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        if(files[0]) {
            recipes[index].image = files[0].src;
        } else {
            recipes[index].image = "//placehold.it/500x360";
        }
    }

    results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    results = await User.isAdmin(req.session.userId);
    const sessionIsAdmin = results.rows[0].is_admin;

    if (!sessionIsAdmin && recipe.user_id != req.session.userId) return res.render("private-access/recipe/list", {
        error: "Ação permitida apenas para administradores ou para o criador da receita",
        recipes,
        session: req.session,
        sessionIsAdmin
    });

    next();
}

async function putOrDelete(req, res, next) {

    let results = await Recipe.all();
    let recipes = results.rows;

    for (let index = 0; index < recipes.length; index++) {
        results = await Recipe.files(recipes[index].id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        if(files[0]) {
            recipes[index].image = files[0].src;
        } else {
            recipes[index].image = "//placehold.it/500x360";
        }
    }

    results = await Recipe.find(req.body.id);
    const recipe = results.rows[0];

    results = await User.isAdmin(req.session.userId);
    const sessionIsAdmin = results.rows[0].is_admin;

    if (!sessionIsAdmin && recipe.user_id != req.session.userId) return res.render("private-access/recipe/list", {
        error: "Ação permitida apenas para administradores ou para o criador da receita",
        recipes,
        session: req.session,
        sessionIsAdmin
    });

    next();
}



module.exports = {
    edit,
    putOrDelete
}