module.exports = (period) => {
    return (_, res, next) => {
        if (period !== undefined) {
            res.set('Cache-control', `public, max-age=${period}`)
        }
        else {
            res.set('Cache-control', `no-store`);
        }
        next();
    };
};
