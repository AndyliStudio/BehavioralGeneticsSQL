# 人类行为遗传基因数据库
对行为与遗传的关系的研究。动物物种的特异行为模式，如蜜蜂传达食源信息的舞蹈、蜘蛛的结网、燕子的造巢和海狸的筑坝，在个体中的实现都被认为是由遗传因素决定的，个体学习的成分极少，常被称为本能行为。人的行为和性格特点，以及智力的高低是否也有遗传原因，科学家早已注意到了这个问题。特别是当人们了解到基因的物质结构时，从事这种研究的理论基础就更加完备，形成了遗传学研究的一个新的分支──行为遗传学。

## 使用技术
+ AngularJS
+ BootStrap
+ JQuery

## 后台和数据库
+ loopBack
+ mySQL

## 主要功能
+ Phenotype 
+ Gene/Region
+ Marker
+ Pathway
+ Browser

## 安装运行

安装依赖：
```
cd 项目根目录
npm install
```
然后运行它：
```
node .
```
然后在浏览器打开 [http://localhost:9000/](http://localhost:9000/)

## 其他问题
### 1. 如何设置loopback接口支持跨域
参考教程  http://loopback.io/doc/en/lb2/Security-considerations.html#deprecation-of-built-in-cors-middleware
### 2. 数据第一行描述信息记得加一个#在前面
因为第一行默认被作为描述行，另外snp_info表的residual_var和p值需要使用科学计数法的形式。
### 3. 执行插入数据之前记得使用createTable将数据清空
请先执行数据库初始化js，在执行自动导入数据的js
```
cd 项目根目录  
node server/tools/createTable.js
node server/tools/readAndSave.js

```
![autoImport](https://olpkwt43d.qnssl.com/benefit/autoImport.png)

# 基因查询的算法
snpinfo====>
trait --- input search 
user input  if p < user input print

gene_info --- Locus --- snpinfo.pos in (start, stop) && user input < p ===> print
              [start, stop] --- snpinfo.pos in (start, stop) && user input < p ===> print

snp-info
marker --- 显示marker相关信息

pathway_name --- genes --- gene -- 基因名字－－gene_info.locus && user input < p ===> print -- print
