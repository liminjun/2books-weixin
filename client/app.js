//app.js
const defaultTime = {
    defaultWorkTime: 25,
    defaultRestTime: 5
}


var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    userInfo: null,
    onLaunch: function () {

        //设置登录地址
        qcloud.setLoginUrl(config.service.loginUrl);
        //请求登录
        qcloud.login({
            success: function (userInfo) {
                console.log('登录成功', userInfo);
                App.userInfo = userInfo;
            },
            fail: function (err) {
                console.log('登录失败', err);
            }
        });

    },
    getUserId: function () {
        if (App.userInfo) {
            return App.userInfo.uuid;
        }
        else {
            return null;
        }
    },
    getUserInfo: function () {
        if (App.userInfo) {
            return App.userInfo
        }
        else {
            return null;
        }

    },
    globalData: {
        userInfo: 'init',
        booksUpdate: false,  //书架是否刷新  
        myBookUpdate: false,   //我的图书是否刷新
    }
})