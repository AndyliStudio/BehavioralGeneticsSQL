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

/**
 * 执行读取文件的函数
 * @param url  文件路径
 * @param total  文件总行数
 */
function doRead(url, filename, total){
  // 初始化一个进度条长度为 50 的 ProgressBar 实例
  let pb = new ProgressBar('读取gene_info.txt', 50)
  // 这里只是一个 pb 的使用示例，不包含任何功能
  let num = 0
  const r1 = readline.createInterface({
      input: fs.createReadStream(url),
      output: process.stdout,
      terminal: false
  });

  r1.on('line', (line) => {
      pb.render({ completed: ++ num, total: total });
      console.log('Line from file:' + num + ":" + line)
      // 跳过第一行描述信息
      if(num === 1){
        return
      }
      let byteArr = line.split(/[\t ]/g)
      if(filename === 'pathway.txt'){
        let pathway = byteArr[0]
        let url = byteArr[1]
        biteArr.splice(0, 2)
        let genes = biteArr
      }
  });
}

/**
 * 执行存储操作的函数
 * @param tablename 表名字
 * @param data 存储的数组
 * @param cb 回调
 */
function doSave(tablename, data, cb){
  
}
// doRead(path.resolve(__dirname, file_config.geneinfo.url), 'gene_info.txt', 114078);
doRead(path.resolve(__dirname, file_config.pathway.url), 'pathway.txt', 217);