// 数据导入工具, 执行导入操作 cd /server/boot/ && node readAndSave.js

const file_config = {
  geneinfo: { url: '../../test_data/gene_info.txt', total_lines: '' },
  pathway: { url: '../../test_data/pathway.txt', total_lines: 217 },
  snpinfo: { url: '../../test_data/snp_info.txt', total_lines: 3515 }
}

const readline = require('readline')
const fs = require("fs")
var path = require('path')
var ProgressBar = require('./progressBar')
var app = require(path.resolve(__dirname, '../server'))
var eventproxy = require('eventproxy')

var ep01 = new eventproxy()
var ep02 = new eventproxy()
var ep03 = new eventproxy()

ep01.all('readPathway', function (pathway) {
  if (pathway === 'success') {
    ep02.all('readSnpinfo', function (snpinfo) {
      if (snpinfp === 'success') {
        ep03.all('readGeneinfo', function (snpinfo) {
          if (snpinfp === 'success') {
            console.log('读取完毕！');
          } else if (snpinfo === 'fail') {
            console.log('读取并存储geneinfo失败！');
          }
        })
        doRead(path.resolve(__dirname, file_config.geneinfo.url), 'gene_info.txt', 114078, function (str) {
          ep03.emit('readGeneinfo', str)
        });
      } else if (snpinfo === 'fail') {
        console.log('读取并存储snpinfo失败！');
      }
    })
    doRead(path.resolve(__dirname, file_config.snpinfo.url), 'snp_info.txt', file_config.snpinfo.total_lines, function (str) {
      ep02.emit('readSnpinfo', str)
    });
  } else if (pathway === 'fail') {
    console.log('读取并存储pathway失败！');
  }
})
// doRead(path.resolve(__dirname, file_config.geneinfo.url), 'gene_info.txt', 114078);
doRead(path.resolve(__dirname, file_config.pathway.url), 'pathway.txt', file_config.pathway.total_lines, function (str) {
  ep01.emit('readPathway', str)
});


/** 
 * 执行读取文件的函数
 * @param url  文件路径
 * @param filename 文件名
 * @param total  文件总行数
 * @param callback 回调函数
 */
function doRead(url, filename, total, callback) {
  // 初始化一个进度条长度为 50 的 ProgressBar 实例
  let pb = new ProgressBar('读取并存储' + filename + ' ', 50)
  let error_output = []
  // 这里只是一个 pb 的使用示例，不包含任何功能
  let num = 0
  let r1 = readline.createInterface({
    input: fs.createReadStream(url),
    output: process.stdout,
    terminal: false
  });
  r1.on('line', (line) => {
    // console.log('Line from file:' + num + ":" + line)
    // 跳过描述信息
    try {
      if (line.substring(0, 1) === '#') {
        return
      }
      let byteArr = line.split(/[\t ]/g)
      if (filename === 'pathway.txt') {
        let finalData = {}
        finalData.pathway = byteArr[0]
        finalData.url = byteArr[1]
        byteArr.splice(0, 2)
        finalData.genes = byteArr
        doSave('pathway', finalData, function (obj) {
          if (!obj) {
            pb.render({ completed: ++num, total: total })
            if (num === total) {
              if (typeof callback === 'function') {
                callback('success')
              }
            }
          } else {
            if (num === total) {
              if (typeof callback === 'function') {
                callback('success')
              }
              // 输出所有的错误日志
              error_output.forEach(item => {
                console.log('第 ' + item.num + '行的pathway ' + item.id + ' 读取失败, 错误原因: ' + item.msg);
              })
            } else {
              obj.num = num
              error_output.push(obj)
            }
          }
        })
      } else if (filename === 'snp_info.txt') {
        let finalData02 = {}
        finalData02.trait = byteArr[0]
        finalData02.marker = byteArr[1]
        finalData02.chr = parseInt(byteArr[2])
        finalData02.pos = parseInt(byteArr[3])
        finalData02.df = parseInt(byteArr[4])
        finalData02.F = byteArr[5]
        finalData02.p = byteArr[6]
        finalData02.add_effect = byteArr[7]
        finalData02.add_f = byteArr[8]
        finalData02.add_p = byteArr[9]
        finalData02.dom_effect = byteArr[10]
        finalData02.dom_f = byteArr[11]
        finalData02.dom_p = byteArr[12]
        finalData02.errordf = byteArr[13]
        finalData02.markerR2 = byteArr[14]
        finalData02.genetic_var = byteArr[15]
        finalData02.residual_var = byteArr[16]
        finalData02.LnLikelihood = byteArr[17]
        doSave('snp_info', finalData02, function (obj) {
          if (!obj) {
            pb.render({ completed: ++num, total: total })
            if (num === total) {
              if (typeof callback === 'function') {
                callback('success')
              }
            }
          } else {
            if (num === total) {
              if (typeof callback === 'function') {
                callback('success')
              }
              // 输出所有的错误日志
              error_output.forEach(item => {
                console.log('第 ' + item.num + '行的pathway ' + item.id + ' 读取失败, 错误原因: ' + item.msg);
              })
            } else {
              obj.num = num
              error_output.push(obj)
            }
          }
        })
      } else if (filename === 'gene_info.txt') {

      }
    } catch (error) {
      console.log(error)
      error_output.forEach(item => {
        console.log('第 ' + item.num + '行读取失败, 错误原因: ' + error.toString());
      })
      if (typeof callback === 'function') {
        callback('fail')
      }
    }
  })
}

/**
 * 执行存储操作的函数
 * @param modelname 模型名字
 * @param data 存储的数组
 * @param cb 回调
 */
function doSave(modelname, data, cb) {
  if (modelname === 'pathway') {
    app.models.pathway.findOrCreate({ pathway: data.pathway }, { pathway: data.pathway, url: data.url, genes: data.genes }, function (err, res) {
      if (err) {
        if (typeof cb === 'function') {
          cb({ id: data.pathway, msg: err.toString() })
        }
        return
      }
      if (typeof cb === 'function') {
        cb()
      }
    })
  } else if (modelname === 'snp_info') {
    app.models.snp_info.findOrCreate({ marker: data.marker }, { marker: data.marker, chr: data.chr, pos: data.pos, df: data.df, F: data.F, p: data.p, add_effect: data.add_effect, add_f: data.add_f, add_p: data.add_p, dom_effect: data.dom_effect, dom_f: data.dom_f, dom_p: data.dom_p, errordf: data.errordf, markerR2: data.markerR2, genetic_var: data.genetic_var, residual_var: data.residual_var, LnLikelihood: data.LnLikelihood }, function (err, res) {
      if (err) {
        if (typeof cb === 'function') {
          cb({ id: data.marker, msg: err.toString() })
        }
        return
      }
      if (typeof cb === 'function') {
        cb()
      }
    })
  }
}
