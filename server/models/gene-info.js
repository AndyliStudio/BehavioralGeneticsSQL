'use strict';
var DataSource = require('loopback-datasource-juggler').DataSource;
var dataSource = new DataSource({
    connector: require('loopback-connector-mysql'),
    host: "qdm1300839.my3w.com",
    port: 3306,
    database: "qdm1300839_db",
    username: "qdm1300839",
    password: "121960425sql",
    insecureAuth: true,
});

// dataSource.discoverModelDefinitions({views: true, limit: 20}, function(err, models){
//     if(err){
//         console.log('查询语句 SELECT * FROM gene_info WHERE gene_name like BnaC04g205% 执行失败，+'+err);
//     }
//     //test
//     console.log("这是ds list");
//     console.log(models);
// });

module.exports = function (Geneinfo) {
    // Geneinfo.beforeRemote('create', function (context, user, next) {
    //     context.args.data.date = Date.now();
    //     context.args.data.publisherId = context.req.accessToken.userId;
    //     console.log(context);
    //     next();
    // });
    //根据表单提交的信息获取和这个基因相关的SNP信息
    Geneinfo.getSNP = function (byGeneName, cb) {
        var sql = "SELECT * FROM gene_info WHERE id = ?";
        // console.log(dataSource.connector);
        dataSource.connector.execute(sql, 1000, function(err,  allGeneNames){
            if(err){
                console.log('查询语句 SELECT * FROM gene_info WHERE gene_name like BnaC04g205% 执行失败，+'+err);
            }
            console.log(allGeneNames);
            // cb(err, allGeneNames);
        });
    };

    Geneinfo.remoteMethod(
        'getSNP',
        {
            http: { path: '/getSNP', verb: 'get' },
            description: "根据基因的名字查询数据库",
            returns: { arg: 'getSNP', type: 'string' }
        }
    );
};
