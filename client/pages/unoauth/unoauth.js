var app = getApp();
Page({
    data: {

    },
    login: function (e) {
        
        // 微信用户登录小程序
        wx.BaaS.login().then((res) => {
            // 用户允许授权，res 包含用户完整信息，详见下方描述
            wx.switchTab({
                url: '/pages/index/index'
              })
        }, (res) => {
            
        })
    }
})