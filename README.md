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
## 安装
确保你已经全局安装了strongloop, yo, generator-ui-router 以及generator-loopback-angular-ui-router
使用以下命令进行安装：
```
npm install -g bower
npm install -g grunt
npm install -g grunt-cli
npm install -g strongloop
npm install -g yo
npm install -g generator-angular-ui-router
npm install -g generator-loopback-angular-ui-router
```

## 运行
安装依赖：
```
cd <your project folder>
npm install & bower install
```
然后运行它：
```
grunt serve
```
如果需要发布版本：

```
grunt
```
在dist目录下会生成最新的发布文件。
如果需要使用loopback构建的`/explorer`和`/api`，你可以使用
```
node .
```
然后在浏览器打开 [http://localhost:9000/](http://localhost:9000/)
