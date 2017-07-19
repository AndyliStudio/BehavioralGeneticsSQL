'use strict';
const app = require(__dirname + '/../server.js')

module.exports = function (Snpinfo) {
  Snpinfo.searchMarker = function (sstr, cb) {//定义一个http接口方法
    Snpinfo.find({ where: { marker: new RegExp(sstr, 'igm') }, fields: { marker: true, id: true } })
      .then(function (res) {
        if (res instanceof Array) {
          cb(null, res)
        } else {
          cb(null, { name: 'Error', status: 500, message: "查询snp_info失败，返回非数组", errno: -1 });
        }
      })
      .catch(function (err) {
        console.log(err);
        cb(null, { name: 'Error', status: 500, message: err.toString(), errno: -1 });
      });
  }

  Snpinfo.remoteMethod(//把方法暴露给http接口
    'searchMarker',
    {
      'accepts': [{ arg: 'sstr', type: 'string' }],
      'returns': [
        { 'arg': 'result', 'type': 'string' }
      ],
      'http': {
        'verb': 'get',
        'path': '/searchMarker'
      }
    }
  )

  Snpinfo.searchTrait = function (sstr, cb) {//定义一个http接口方法
    Snpinfo.find({ where: { marker: new RegExp(sstr, 'igm') }, fields: { marker: true, id: true } })
      .then(function (res) {
        if (res instanceof Array) {
          cb(null, res)
        } else {
          cb(null, { name: 'Error', status: 500, message: "查询snp_info失败，返回非数组", errno: -1 });
        }
      })
      .catch(function (err) {
        console.log(err);
        cb(null, { name: 'Error', status: 500, message: err.toString(), errno: -1 });
      });
  }

  Snpinfo.remoteMethod(//把方法暴露给http接口
    'searchTrait',
    {
      'accepts': [{ arg: 'sstr', type: 'string' }],
      'returns': [
        { 'arg': 'result', 'type': 'string' }
      ],
      'http': {
        'verb': 'get',
        'path': '/searchTrait'
      }
    }
  )
};
