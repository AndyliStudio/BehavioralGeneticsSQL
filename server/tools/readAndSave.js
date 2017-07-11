// 数据导入工具, 执行导入操作 cd /server/boot/ && node readAndSave.js

const file_config = {
  geneinfo: {url: '../../test_data/gene_info.txt', total_lines: ''},
  pathway: {url: '../../test_data/pathway.txt', total_lines: ''},
  snpinfo: {url: '../../test_data/snp_info.txt', total_lines: ''}
}

const readline = require('readline')
const fs = require("fs")
var path = require('path')
var ProgressBar = require('./progressBar')
var app = require(path.resolve(__dirname, '../server'))


/** 
 * 执行读取文件的函数
 * @param url  文件路径
 * @param total  文件总行数
 */
function doRead(url, filename, total){
  // 初始化一个进度条长度为 50 的 ProgressBar 实例
  let pb = new ProgressBar('读取并存储'+filename+' ', 50)
  let error_output = []
  // 这里只是一个 pb 的使用示例，不包含任何功能
  let num = 0
  const r1 = readline.createInterface({
      input: fs.createReadStream(url),
      output: process.stdout,
      terminal: false
  });
  r1.on('line', (line) => {
      // console.log('Line from file:' + num + ":" + line)
      // 跳过描述信息
      try{
          if(line.substring(0, 1) === '#'){
          return
        }
        let byteArr = line.split(/[\t ]/g)
        if(filename === 'pathway.txt'){
          let finalData = {}
          finalData.pathway = byteArr[0]
          finalData.url = byteArr[1]
          byteArr.splice(0, 2)
          finalData.genes = byteArr
          doSave('pathway', finalData, function(obj){
            if(!obj){
              pb.render({ completed: ++ num, total: total })
            }else{
              if(num === (total + 1)){
                // 输出所有的错误日志
                error_output.forEach(item => {
                  console.log('第 '+ item.num + '行的pathway '+ item.id + ' 读取失败, 错误原因: ' + item.msg);
                })
              }else{
                obj.num = num
                error_output.push(obj)
              }
            }
          })
        }
      }catch(error){
        console.log(error)
        if(num === (total + 1)){
          // 输出所有的错误日志
          error_output.forEach(item => {
            console.log('第 '+ item.num + '行读取失败, 错误原因: ' + error.toString());
          })
        }else{
          obj.num = num
          error_output.push(obj)
        }
      }
  })
}

/**
 * 执行存储操作的函数
 * @param modlename 模型名字
 * @param data 存储的数组
 * @param cb 回调
 */
function doSave(modlename, data, cb){
  app.models[modlename].findOrCreate({pathway: data.pathway}, {pathway: data.pathway, url: data.url, genes: data.genes}, function(err, res){
    if(err){
      if(typeof cb === 'function'){
        cb({id: data.pathway, msg:err.toString()})
      }
      return
    }
    if(typeof cb === 'function'){
      cb()
    }
  })
}
// doRead(path.resolve(__dirname, file_config.geneinfo.url), 'gene_info.txt', 114078);
doRead(path.resolve(__dirname, file_config.pathway.url), 'pathway.txt', 217);