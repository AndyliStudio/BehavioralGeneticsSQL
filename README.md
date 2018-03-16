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

## 部署项目所需
服务器硬件条件： 可外网访问、域名、可ssh登录、本地mysql

服务器用到的工具: 
1. mysql 放本地就好，这样查询比较快
2. nginx node服务是在9000端口启动的，需要nginx代理到80端口供外网访问
3. sftp 上传博客所需，项目集成了一套博客发布工具，可以在本地通过sftp或者ftp修改博客内容
4. nodejs执行环境，这个比较好装，只需要外网能访问，通过npm就可以快速下载项目所需的依赖包
5. ssh 最好能提供shh登录，方便对部署的代码做改动
6. git 用来下载和同步项目源码


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
### 4. 如果user.js新建方法总是出现401权限错误，请在user.json中设置：
```
"mixins": {
  "ClearBaseAcls": true
}
```
这可以将用户模型基本的权限控制清除，然后自己再通过`lb acl`定义user模型的权限控制规则，详情请参见[strongloop issues](https://github.com/strongloop/loopback/issues/559)
