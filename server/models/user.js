'use strict';

module.exports = function (User) {
  User.contactUs = function (name, email, tel, message, cb) {//定义一个http接口方法
    console.log(name)
    cb(null, { a: 1 })
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