// miniprogram/pages/favorDetail/favorDetail.js
var app = getApp();
Page({
  /**
   * Page initial data
   */
  data: {
    dataSource: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var player = this.selectComponent("#player");
    // console.log(player);
    app.globalData.player = player;
    this.getMusic();
  },

  getMusic: function() {
    //console.log("getFavorMusics")
    const db = wx.cloud.database();
    // var list;
    //查询当前用户所有的counters
    //查询结果需要返回哪个属性，就在下面写出哪一项，并设置为true
    db.collection("music_favor")
      // .field({
      //   playState: true,
      //   musicPic: true,
      //   musicName: true,
      //   musicUrl: true,
      //   artistName: true
      // })
      .get({
        success: res => {
          //输出一下是否获取到了默认歌曲，值在res.data中
          //因为是按照属性进行筛选，所以返回的是一个集合，我们自己知道只有一个记录
          //所以要的是这个数据集合的第一条，也就是res.data[0]
          // console.log("getdefault", res);
          // console.log("data[0]", res.data[0]);

          // for (let i = 0; i < res.data.length; i++) {
          //   // const element = res.data[i];

          // }
          this.setData({
            dataSource: res.data
          });
          // console.log(this.data.dataSource)
          // (this.globalData.playState = res.data[0].playState),
          //   (this.globalData.musicPic = res.data[0].musicPic),
          //   (this.globalData.musicName = res.data[0].musicName),
          //   (this.globalData.musicUrl = res.data[0].musicUrl),
          //   (this.globalData.artistName = res.data[0].artistName);
          // console.log("name", this.globalData.artistName);
        },
        fail: err => {
          wx.showToast({
            icon: "none",
            title: "查询记录失败"
          });
          console.error("[数据库][查询记录]失败:", err);
        }
      });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {}
});
