Page({
  data: {
    categories: [],
    categoryIndex: 0,
    feedbackContent: null,
    textLength: 0
  },
  onLoad(options) {
    this.fetchCategoryList()
  },
  charChange: function (e) {
    this.setData({
      textLength: e.detail.value.length
    });
    // if (e.detail && e.detail.value.length > 0) {
    //   if (e.detail.value.length < 4 || e.detail.value.length > 200) {
    //     wx.showToast('内容为4-200个字符', 'loading', 1200);
    //   }
    // } else {
    //   wx.showToast('请输入反馈内容', 'loading', 1200);
    // }
  },
  //bindCategoryChange
  bindCategoryChange: function (e) {
    //console.log('picker category 发生选择改变，携带值为', e.detail.value);

    this.setData({
      categoryIndex: e.detail.value
    })
  },
  //获取反馈分类列表
  fetchCategoryList() {
    let that = this
    let tableID = 1244
    let objects = {
      tableID
    }

    wx.BaaS.getRecordList(objects).then((res) => {
      that.setData({
        categories: res.data.objects
      })
    }, (err) => {
      console.dir(err)
    });
  },

  //添加反馈
  submitFeedback(e) {

    if (e.detail.value.textarea.length ==0) {

      wx.showToast({
        title: '反馈内容不能为空!',
        icon: 'loading',
        duration: 2000
      });

      return;
    }


    let that = this
    let tableID = 1243; //反馈表ID
    let selectedCategoryId = this.data.categories[this.data.categoryIndex].id;

    let feedbackContent = e.detail.value.textarea

    let data = {
      categoryId: selectedCategoryId,
      content: feedbackContent
    }
    let objects = {
      tableID,
      data
    }

    // 创建一个数据项
    wx.BaaS.createRecord(objects).then((res) => {

      wx.showToast({
        title: '反馈成功',
        icon: 'success',
        duration: 2000
      });
      e.detail.value.textarea = "";
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/setting/setting'
        });
      }, 2000);

    }, (err) => {
      console.log(err)
    })
  },



})