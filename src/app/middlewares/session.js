function onlyUsers(req, res, next) {
    if(!req.session.userId) {
        return res.redirect("/admin/users/login");
    }

    next();
}

function isLoggedRedirectToUsers(req, res, next) {
    if(req.session.userId) {
        return res.redirect("/admin/recipes");
    }

    next();
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers
}