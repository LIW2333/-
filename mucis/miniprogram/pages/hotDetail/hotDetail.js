// pages/hotDetail/hotDetail.js
var songList = require("../../source/songList.js");
var app = getApp();
Page({
  /**
   * Page initial data
   */
  data: {
    singer: null,
    poster: null,
    dataSource: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var player = this.selectComponent("#player");
    console.log(player);
    app.globalData.player = player;
    const { singer, poster } = options;
    console.log(singer, poster);
    this.setData({
      singer: singer,
      poster: decodeURIComponent(poster)
    });
    // console.log("info:");
    // console.log(songList.Sawano);
    console.log();
    switch (singer) {
      case "泽野弘之":
        // this.insertMusic("Sawano",songList.Sawano);
        this.getMusic("Sawano")
        // console.log(this.data.dataSource);
        break;
      case "μ's":
        // this.insertMusic("mius",songList.mius);
        // this.setData({
        //   dataSource: songList.mius
        // });
        this.getMusic("mius")
        break;
      case "上原玲奈":
        // this.insertMusic("Rena",songList.Rena);
        // this.setData({
        //   dataSource: songList.Rena
        // });
        this.getMusic("Rena")
        break;
    }
  },

  getMusic: function(singer) {
    //console.log("getFavorMusics")
    const db = wx.cloud.database();
    var list;
    //查询当前用户所有的counters
    //查询结果需要返回哪个属性，就在下面写出哪一项，并设置为true
    db.collection(singer)
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

  insertMusic: function(singer, songs) {
    //将默认歌曲添加到云数据库
    const db = wx.cloud.database();
    //需要选择你自己建立的表
    for (let index = 0; index < songs.length; index++) {
      // const element = singer[index];
      db.collection(singer).add({
        data: {
          id: songs[index].id,
          name: songs[index].name,
          src: songs[index].src,
          poster: songs[index].poster
        },
        success: res => {
          //在返回结果中会包含新创建的记录的_id
          this.setData({
            counterId: res._id,
            count: 1
          });
          wx.showToast({
            title: "插入默认信息成功"
          });
          console.log("[数据库][新增记录]成功，记录_id:", res._id);
        },
        fail: err => {
          wx.showToast({
            icon: "none",
            title: "新增记录失败"
          });
          console.error("[数据库][新增记录]失败:", err);
        }
      });
    }
    // db.collection(singer).add({
    //   data: {
    //     // playState: DEFAULT_MUSIC.playState,
    //     // musicPic: DEFAULT_MUSIC.musicPic,
    //     // musicName: DEFAULT_MUSIC.musicName,
    //     // musicUrl: DEFAULT_MUSIC.musicUrl,
    //     // artistName: DEFAULT_MUSIC.artistName
    // //     id: singer[0].id
    // // name:
    // // src:
    // // poster：
    //   },
    //   success: res => {
    //     //在返回结果中会包含新创建的记录的_id
    //     this.setData({
    //       counterId: res._id,
    //       count: 1
    //     });
    //     wx.showToast({
    //       title: "插入默认信息成功"
    //     });
    //     console.log("[数据库][新增记录]成功，记录_id:", res._id);
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: "none",
    //       title: "新增记录失败"
    //     });
    //     console.error("[数据库][新增记录]失败:", err);
    //   }
    // });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    console.log(this.data.dataSource);
  },

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
