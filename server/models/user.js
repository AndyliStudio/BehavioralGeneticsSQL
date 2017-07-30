'use strict';
const nodemailer = require('nodemailer')
const app = require(__dirname + '/../server.js')

module.exports = function (User) {
  User.contactUs = function (name, email, tel, message, cb) {//定义一个http接口方法
    // 格式化message,将换行符替换成<br>,将空格替换成&nbsp;
    message = message.replace(/\n/g, '<br>')
    message = message.replace(/ /g, '&nbsp;')
    app.models.email.send({
      to: email,
      from: 'andyliwr@outlook.com',
      subject: '问题反馈---来自人类遗传基因数据库网站',
      // text: message,
      html: '姓名:&nbsp;' + name + '<br>用户邮箱:&nbsp;' + email + (tel ? '<br>电话:&nbsp;' + tel : '') + '<br>反馈内容:<br>' + message
    }, function (err, mail) {
      if (err) {
        cb(null, { code: 1, message: '提交反馈失败' + err.toString() })
      } else {
        cb(null, { code: 0, message: '我们已经收到你的反馈' })
      }
    });
  }

  User.remoteMethod(//把方法暴露给http接口
    'contactUs',
    {
      'accepts': [
        { arg: 'name', type: 'string' },
        { arg: 'email', type: 'string' },
        { arg: 'tel', type: 'string' },
        { arg: 'message', type: 'string' }
      ],
      'returns': [
        { 'arg': 'result', 'type': 'string' }
      ],
      'http': {
        'verb': 'post',
        'path': '/contactUs'
      }
    }
  )
};