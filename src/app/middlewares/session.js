function onlyUsers(req, res, next) {
    if(!req.session.userId) {
        return res.redirect("/admin/users/login");
    }

    next();
}

function isLoggedRedirectToUsers(req, res, next) {
    if(req.session.userId) {
        return res.redirect("/admin/users/list");
    }

    next();
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers
}