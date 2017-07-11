// 用来初始化数据库，在命令行执行node /server/createTable.js

var async = require('async');
var path = require('path');
var app = require(path.resolve(__dirname, '../server'));

var dataSource = app.dataSources.mysqlDs;

//生成必备表
dataSource.automigrate('AccessToken', function (err) {
  if (err) throw err;
  console.log('AccessToken model migrated');
  //dataSource.disconnect();
});

dataSource.automigrate('ACL', function (err) {
  if (err) throw err;
  console.log('ACL model migrated');
  //dataSource.disconnect();
});

dataSource.automigrate('RoleMapping', function (err) {
  if (err) throw err;
  console.log('RoleMapping model migrated');
  //dataSource.disconnect();
});

dataSource.automigrate('Role', function (err) {
  if (err) throw err;
  console.log('Role model migrated');
  // dataSource.disconnect();
});

dataSource.automigrate('gene_info', function (err) {
  if (err) return cb(err);
  console.log('gene_info model migrated');
});

dataSource.automigrate('pathway', function (err) {
  if (err) return cb(err);
  console.log('pathway model migrated');
});

dataSource.automigrate('snp_info', function (err) {
  if (err) return cb(err);
  console.log('snp_info model migrated');
});
