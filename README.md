git # BehavioralGeneticsSQL
人类行为遗传数据库，创建于2015-09-26

# 使用技术
+ AngularJS
+ BootStrap
+ JQuery

# 后台和数据库
+ loopBack
+ mySQL

# 主要功能
+ Phenotype
+ Gene/Region
+ Marker
+ Pathway
+ Browser

# 安装运行

安装依赖：
```
cd <your project folder>
npm install
```
然后运行它：
```
slc run
```
如果需要使用loopback构建的`/explorer`和`/api`，你可以使用
```
node .
```
然后在浏览器打开 [http://localhost:9000/](http://localhost:9000/)

# 其他问题
## 如何设置loopback接口支持跨域
参考教程  http://loopback.io/doc/en/lb2/Security-considerations.html#deprecation-of-built-in-cors-middleware
## 数据第一行描述信息记得加一个#在前面
因为第一行默认被作为描述行
## 执行插入数据之前记得使用createTable将数据清空
请先执行数据库初始化js，在执行自动导入数据的js
```
cd 项目根目录  
node server/tools/createTable.js
node server/tools/readAndSave.js

```
![autoImport](https://olpkwt43d.qnssl.com/benefit/autoImport.png)