// 用来初始化数据库，在命令行执行node /server/createTable.js

var async = require('async')
var path = require('path')
var app = require(path.resolve(__dirname, '../server'))
var eventproxy = require('eventproxy')

var ep = new eventproxy()
ep.all('user', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'gene_info', 'pathway', 'snp_info', 'email', function (accesstoken, acl, rolemapping, role, geneinfo, pathway, snpinfo, email) {
  console.log('\nEverything is ready!')
  dataSource.disconnect()
  process.exit(0)
})

var dataSource = app.dataSources.mysqlDs

//生成必备表
// dataSource.automigrate('user', function (err) {
//   if (err) throw err
//   console.log('user表初始化完毕!')
//   ep.emit('user', '')
// })

// dataSource.automigrate('AccessToken', function (err) {
//   if (err) throw err
//   console.log('AccessToken表初始化完毕!')
//   ep.emit('AccessToken', '')
// })

// dataSource.automigrate('ACL', function (err) {
//   if (err) throw err
//   console.log('ACL表初始化完毕!')
//   ep.emit('ACL', '')
// })

// dataSource.automigrate('RoleMapping', function (err) {
//   if (err) throw err
//   console.log('RoleMapping表初始化完毕!')
//   ep.emit('RoleMapping', '')
// })

// dataSource.automigrate('Role', function (err) {
//   if (err) throw err
//   console.log('Role表初始化完毕!')
//   ep.emit('Role', '')
// })

dataSource.automigrate('gene_info', function (err) {
  if (err) throw err
  console.log('gene_info表初始化完毕!')
  ep.emit('gene_info', '')
})

dataSource.automigrate('pathway', function (err) {
  if (err) throw err
  console.log('pathway表初始化完毕!')
  ep.emit('pathway', '')
})

dataSource.automigrate('snp_info', function (err) {
  if (err) throw err
  console.log('snp_info表初始化完毕!')
  ep.emit('snp_info', '')
})

// dataSource.automigrate('email', function (err) {
//   if (err) throw err
//   console.log('email表初始化完毕!')
//   ep.emit('email', '')
// })

