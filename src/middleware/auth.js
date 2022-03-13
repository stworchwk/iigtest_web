const auth = ({
    next,
    router
}) => {
    if (!localStorage.token_access) {
        return router.push({
            name: 'login'
        });
    }

    return next();
}

export default auth;