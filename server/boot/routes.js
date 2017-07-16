// Copyright IBM Corp. 2014. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT


module.exports = function (app) {
  // 数据下载的接口，导出为excel
  app.post('/api/download', function (req, res, next) {
    console.log(req)
  })
};
