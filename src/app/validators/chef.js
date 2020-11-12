const User = require("../models/User");
const Chef = require("../models/Chef");

async function onlyAdmin(req, res, next) {

    let results = await Chef.all();
    let chefs = results.rows;

    for (let index = 0; index < chefs.length; index++) {
        results = await Chef.files(chefs[index].id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        if(files[0]) {
            chefs[index].image = files[0].src;
        } else {
            chefs[index].image = "//placehold.it/500x360";
        }
    }

    results = await User.isAdmin(req.session.userId);
    const sessionIsAdmin = results.rows[0].is_admin;

    if (!sessionIsAdmin) return res.render("private-access/chef/list", {
        error: "Ação permitida apenas para administradores",
        chefs,
        session: req.session,
        sessionIsAdmin
    });

    next();
}

module.exports = {
    onlyAdmin
}