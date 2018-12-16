// pages/page2.js
const APP = getApp();
const request = require('../../utils/util.js').request;
const AppURL = 'http://2books.duapp.com/api/';
Page({
  data: {
    winHeight: '',//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    showBooks: [], //获取的书籍
    tags: [], //书籍分类
    currentPages: [], //记录当前tab分页查询当前page
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    console.log('switchTab');
    let index = e.detail.current//分类索引
    //设置当前页
    this.setData({
      currentTab: index
    });
    this.checkCor();
    //判断数组里面是否加载过数据
    if (!this.data.showBooks[index]) {
      this.getBooks(this.data.tags[index].category_id, index+1);
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var currentIndex = e.target.dataset.current;
    if (this.data.currentTab == currentIndex) { return false; }
    else {
      this.setData({
        currentTab: currentIndex
      })
    };
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    console.log('checkFor');
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    //获取图书分类
    this.getBookCategory();
    this.getBooks(0, 0);
    var that = this;
    // 高度自适应

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth;
        //rpxR = 750 / clientWidth;
        //var calc = clientHeight * rpxR - 180;
        //console.log(calc)
        that.setData({
          winHeight: clientHeight - 40,
        });
      }
    });
  },
  // footerTap: app.footerTap
  footerTap: function () {

  },
  /**
   * 获取图书分类
   */
  getBookCategory: function () {
    let that=this;
    request({
      url: AppURL + "book_category_list.php",
      success: function (res) {

        var result=res.data;
        if (res.statusCode === 200&&result.meta.success) {

         
          that.setData({
            tags: result.data
          });
        }
      },
    });
  },
  //tag : 种类
  //index : 种类对应的索引
  /**
   * 获取图书列表
   */
  getBooks: function (categoryId, index, currentPage = 1) {
    let that = this;
    
    request({
      url: AppURL + 'books_list.php?categoryId=' + categoryId + '&pageNum=' + currentPage + "&pageSize=10&bookStatus=1",
      success: function (res) {
        if (res.statusCode === 200) {

          let showBooks = that.data.showBooks;

          showBooks[index] = res.data.data.list;
          that.data.currentPages[index] = currentPage;
          that.setData({
            showBooks : that.data.showBooks,
            currentPages : that.data.currentPages
          });
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        }
      },
    });
  },
  toBorrowBook: function (e) {
    //dataset会将变量变为全部小写
    let isbn = e.currentTarget.dataset.isbn;
    let bookId = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: './borrowBook/index?isbn=' + isbn + '&bookId=' + bookId,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh');
    let data = this.data;
    wx.showNavigationBarLoading();
    this.getBooks(data.tags[data.currentTab], data.currentTab);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let data = this.data;
    if (APP.globalData.booksUpdate) {
      APP.globalData.booksUpdate = false;
      this.getBooks(data.tags[data.currentTab], data.currentTab);
    }
  },
  refresh: function () {
    console.log('refresh');
    //wx.startPullDownRefresh();
  },
  onReachBottom: function () {
    console.log('onReachBottom');
  },
  onPageScroll: function () {
    console.log('onpageScroll');
  }
})