module.exports = {
    userLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            req.flash("error", "Authentication Required")
            res.redirect("/login");
        }
    },
    verifyOwnership(modelType) {
        return function(req, res, next) {
            if (res.locals[modelType].creator.id == res.locals.user._id) {
                next();
            }
            else {
                res.redirect('back')
            }
        }

    }
}
