'use strict';

module.exports = function (Geneinfo) {
    Geneinfo.beforeRemote('create', function (context, user, next) {
        context.args.data.date = Date.now();
        context.args.data.publisherId = context.req.accessToken.userId;
        console.log(context);
        next();
    });
};
