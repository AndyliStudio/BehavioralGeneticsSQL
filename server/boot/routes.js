// Copyright IBM Corp. 2014. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const fs = require('fs')

module.exports = function (app) {
  // 数据下载的接口，导出为excel
  app.get('/api/download/:filename', function (req, res, next) {
    fs.exists(__dirname + '/../download/' + req.params.filename, function (exist) {
      if (exist) {
        res.download(__dirname + '/../download/' + req.params.filename)
      } else {
        res.send('文件不存在！')
      }
    })
  })
};
