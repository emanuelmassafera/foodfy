const User = require("../models/User");

function checkAllFields(body) {
    const keys = Object.keys(body);

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: "Preencha todos os campos"
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

async function create(req, res, next) {

    let results = await User.all();
    const users = results.rows;

    results = await User.isAdmin(req.session.userId);
    const sessionIsAdmin = results.rows[0].is_admin;

    if (!sessionIsAdmin) return res.render("private-access/user/list", {
        error: "Ação permitida apenas para administradores",
        users,
        session: req.session,
        sessionIsAdmin
    });

    next();
}

async function edit(req, res, next) {

    const id = req.params.id;

    let results = await User.all();
    const users = results.rows;

    results = await User.isAdmin(req.session.userId);
    const sessionIsAdmin = results.rows[0].is_admin;

    if (!sessionIsAdmin && id != req.session.userId) return res.render("private-access/user/list", {
        error: "Ação permitida apenas para administradores",
        users,
        session: req.session,
        sessionIsAdmin
    });

    next();
}

async function put(req, res, next) {

    const id = req.body.id;

    let results = await User.all();
    const users = results.rows;

    results = await User.isAdmin(req.session.userId);
    const sessionIsAdmin = results.rows[0].is_admin;

    if (!sessionIsAdmin && id != req.session.userId) return res.render("private-access/user/list", {
        error: "Ação permitida apenas para administradores",
        users,
        session: req.session,
        sessionIsAdmin
    });

    next();
}

async function deleteValidator(req, res, next) {

    const id = req.body.id;

    let results = await User.all();
    const users = results.rows;

    results = await User.isAdmin(req.session.userId);
    const sessionIsAdmin = results.rows[0].is_admin;

    if (!sessionIsAdmin) return res.render("private-access/user/list", {
        error: "Ação permitida apenas para administradores",
        users,
        session: req.session,
        sessionIsAdmin
    });

    if (id == req.session.userId) return res.render("private-access/user/list", {
        error: "Ação inválida",
        users,
        session: req.session,
        sessionIsAdmin
    });

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
            error: "Usuário já cadastrado"
        });
    }

    next();
}

async function update(req, res, next) {
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == "") {
            return res.render("private-access/user/edit", {
                user: req.body,
                session: req.session,
                error: "Preencha todos os campos"
            });
        }
    }

    const { id } = req.body;

    const user = await User.findOne({where: {id}});

    req.user = user;

    next();
}

module.exports = {
    post,
    show,
    update,
    create,
    edit,
    put,
    deleteValidator
}