'use strict';
const app = require(__dirname + '/../server.js')
const xlsx = require('node-xlsx')
const uuid = require('node-uuid')
const fs = require('fs')


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

  Snpinfo.downloadSnp = function (ids, cb) {//定义一个http接口方法
    Snpinfo.find({ where: { id: { inq: ids.split(',') } } }).then(function (res) {
      const data = [['trait', 'marker', 'chr', 'pos', 'df', 'F', 'p', 'add_effect', 'add_f', 'add_p', 'dom_effect', 'dom_f', 'dom_p', 'errordf', 'markerR2', 'genetic_var', 'residual_var', 'LnLikelihood']];
      if (res instanceof Array) {
        res.forEach(item => {
          let tempArr = [];
          tempArr.push(item.trait)
          tempArr.push(item.marker)
          tempArr.push(item.chr)
          tempArr.push(item.pos)
          tempArr.push(item.df)
          tempArr.push(item.F)
          tempArr.push(item.p)
          tempArr.push(item.add_effect)
          tempArr.push(item.add_f)
          tempArr.push(item.add_p)
          tempArr.push(item.dom_effect)
          tempArr.push(item.dom_f)
          tempArr.push(item.dom_p)
          tempArr.push(item.errordf)
          tempArr.push(item.markerR2)
          tempArr.push(item.genetic_var)
          tempArr.push(item.residual_var)
          tempArr.push(item.LnLikelihood)
          data.push(tempArr)
        })
      } else {
        if (res.id) {
          let tempArr2 = []
          tempArr2.push(res.trait)
          tempArr2.push(res.marker)
          tempArr2.push(res.chr)
          tempArr2.push(res.pos)
          tempArr2.push(res.df)
          tempArr2.push(res.F)
          tempArr2.push(res.p)
          tempArr2.push(res.add_effect)
          tempArr2.push(res.add_f)
          tempArr2.push(res.add_p)
          tempArr2.push(res.dom_effect)
          tempArr2.push(res.dom_f)
          tempArr2.push(res.dom_p)
          tempArr2.push(res.errordf)
          tempArr2.push(res.markerR2)
          tempArr2.push(res.genetic_var)
          tempArr2.push(res.residual_var)
          tempArr2.push(res.LnLikelihood)
          data.push(tempArr)
        } else {
          cb(null, { name: 'Error', status: 500, message: '查询snp_info失败', errno: -1 })
        }
      }
      let buffer = xlsx.build([{ name: "download", data: data }]) // Returns a buffer
      let thisUuid = uuid.v1()
      fs.writeFileSync(__dirname + '/../download/' + thisUuid + '.xlsx', buffer, 'binary');
      cb(null, { name: 'success', status: 200, message: '', errno: 0, download_url: '/api/download/' + thisUuid + '.xlsx' })
    }).catch(function (res) {
      cb(null, { name: 'Error', status: 500, message: err.toString(), errno: -1 });
    })
  }

  Snpinfo.remoteMethod(//把方法暴露给http接口
    'downloadSnp',
    {
      'accepts': [{ arg: 'ids', type: 'string' }],
      'returns': [
        { 'arg': 'result', 'type': 'string' }
      ],
      'http': {
        'verb': 'post',
        'path': '/downloadSnp'
      }
    }
  )
};
