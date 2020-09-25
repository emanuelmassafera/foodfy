const User = require("../models/User");

function checkAllFields(body) {
    const keys = Object.keys(body);

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: "Preencha todos os campos."
            };
        }
    }
}

async function show(req, res, next) {
    let results = await User.all();
    const users = results.rows;

    results = await User.isAdmin(req.session.userId);
    const sessionIsAdmin = results.rows[0];

    const id = req.params.id;
    const user = await User.findOne({ where: { id } });

    if (!user) return res.render("private-access/user/list", {
        error: "Usuário não encontrado!",
        users,
        session: req.session,
        sessionIsAdmin
    });

    req.user = user;

    next();
}

async function post(req, res, next) {
    const fillAllFields = checkAllFields(req.body);

    if(fillAllFields) {
        return res.render("private-access/user/create", fillAllFields);
    }

    let { email } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (user) {
        return res.render("private-access/user/create", {
            user: req.body,
            error: "Usuário já cadastrado."
        });
    }

    next();
}

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body);

    if(fillAllFields) {
        return res.render("private-access/user/list", fillAllFields);
    }

    const { id } = req.body;

    const user = await User.findOne({where: {id}});

    req.user = user;

    next();
}

module.exports = {
    post,
    show,
    update
}