var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')


const defaultLogName = {
  work: '工作',
  rest: '休息',
  study: "学习",
  sport: "运动",
  summary: "总结"
}
const actionName = {
  stop: '停止',
  start: '开始',
  end: "结束",
  cancel: "放弃"
}

const initDeg = {
  left: 45,
  right: -45,
}
var app = getApp();
Page({

  data: {
    grids: [0, 1, 2, 3, 4, 5],
    remainTimeText: '',
    timerType: 'work',
    log: {},
    completed: false,
    isRuning: false,
    leftDeg: initDeg.left,
    rightDeg: initDeg.right,

    taskTypeList: [],
    workTime: 0,
    restTime: 0
  },
  onLoad(options) {
    this.fetchTypeList();

    this.getSettingData();
  },
  getSettingData: function () {
    var that = this;

    //获取默认设置
    qcloud.request({
      login: true,
      url: 'https://w52h9qkc.qcloud.la/setting',
      method: "GET",

      success: function (response) {
        console.log(response);
        var responseData=response.data;
        if (responseData.result) {
          that.setData({
            workTime:0.1,// responseData.data.task_minutes,
            restTime: responseData.data.rest_minutes
          });
        } else {
          that.setData({
            workTime: 20,
            restTime: 5
          });
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });



  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'Scrum番茄闹钟',
      path: '/pages/index/index',
      imageUrl: "/image/share.jpg",
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败，再次转发',
          icon: 'success',
          duration: 2000
        });
      },
      complete: function (res) {
        console.log("用户转发了");
      }
    }
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '首页'
    })

    if (this.data.isRuning) return

  },
  //开始任务
  startTimer: function (e) {
    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let dataIndex = e.target.dataset.index;
    let showTime = this.data['workTime']
    let keepTime = showTime * 60 * 1000
    let categoryName = this.logName || this.data.taskTypeList[dataIndex].name;
    let categoryId = this.data.taskTypeList[dataIndex].id;

    if (!isRuning) {
      this.timer = setInterval((function () {
        this.updateTimer()
        this.startNameAnimation()
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }

    this.setData({
      isRuning: !isRuning,
      completed: false,

      remainTimeText: showTime + ':00',
      taskName: categoryName
    })


    this.data.log = {
      categoryName: categoryName,
      startTime: Date.now(),
      keepTime: keepTime,
      endTime: keepTime + startTime,
      action: actionName[isRuning ? 'stop' : 'start'],
      categoryId: categoryId
    }

    //this.saveLog(this.data.log)
  },
  //时钟动画
  startNameAnimation: function () {
    let animation = wx.createAnimation({
      duration: 450
    })
    animation.opacity(0.2).step()
    animation.opacity(1).step()
    this.setData({
      nameAnimation: animation.export()
    })
  },
  pauseTimer: function (e) {

  },
  //取消任务
  cancelTimer: function (e) {

    this.stopTimer();

    let workTime = util.customFormatTime(this.data.workTime, 'HH')
    this.setData({
      remainTimeText: workTime + ':00'
    });
  },
  stopTimer: function (e) {
    // reset circle progress
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right,
      isRuning: false
    });

    // clear timer
    this.timer && clearInterval(this.timer)
  },

  updateTimer: function () {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = util.customFormatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util.customFormatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.customFormatTime(Math.floor(remainingTime) % 60, 'SS')
    let halfTime

    // update text
    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      //任务完成
      this.setData({
        completed: true
      })

      this.data.log = {
        categoryId:log.categoryId,
        categoryName: log.categoryName,
        startTime: log.startTime,
        endTime: log.keepTime + log.startTime
      }

      this.saveLog(this.data.log)


      this.stopTimer()
      return
    }

    // update circle progress
    halfTime = log.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
      })
    }
  },
  //自定义任务名字
  changeLogName: function (e) {
    this.logName = e.detail.value
  },

  //保存任务数据到服务器
  saveLog: function (log) {


    let that = this;
    qcloud.request({
      login: true,
      url: 'https://w52h9qkc.qcloud.la/task/create',
      method:"POST",
      dataType: "json",
      data:log,
      success: function (response) {
        console.log(response);
        if (response.data.result) {
          util.showSuccess("任务保存成功");
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });

   
  },



  //获取任务分类列表
  fetchTypeList: function () {
    let that = this;
    qcloud.request({
      login: true,
      url: 'https://w52h9qkc.qcloud.la/taskCategory',
      success: function (response) {
        console.log(response);
        if (response.data.result) {
          that.setData({
            taskTypeList: response.data.data
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });

  },
})
