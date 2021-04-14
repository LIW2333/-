//app.js
import { DEFAULT_MUSIC } from "./config/index.js";
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error("请使用2.2.3或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        //env参数说明:
        //env参数决定接下来小程序发起的云开发调用(wx.cloud.xxx)会默认请求到哪个云环境的资源
        //此处请填入环境ID,环境ID可打开云控制台查看
        //如不填则使用默认环境(第一个创建的环境)
        env: "coursehomework-ukcu2",
        traceUser: true
      });
      // console.log("test")
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });

    this.globalData.audio.src = DEFAULT_MUSIC.musicUrl;
    // this.getFavorMusics();
    // this.insertDeafultMusic();
    this.getDefaultMusic();
  },
  getFavorMusics: function() {
    console.log("getFavorMusics");
    const db = wx.cloud.database();
    //查询当前用户所有的counters
    db.collection("music_favor")
      .field({
        id: true
        // _id: true
      })
      .get({
        success: res => {
          let musics = new Array(res.data.length + 1);
          let counterIds = new Array(res.data.length + 1);
          // console.log(musics.length)
          res.data.forEach(function(item, index) {
            // musics[item.id] = true;
            // counterIds[item.id] = item._id;
          });
          console.log(musics, counterIds);
          this.globalData.favorMusics = {
            musics: musics,
            counterIds: counterIds
          };
          // console. log( this. globa lData. favorMusics)},
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
  getDefaultMusic: function() {
    //console.log("getFavorMusics")
    const db = wx.cloud.database();
    //查询当前用户所有的counters
    //查询结果需要返回哪个属性，就在下面写出哪一项，并设置为true
    db.collection("music_default")
      .field({
        playState: true,
        musicPic: true,
        musicName: true,
        musicUrl: true,
        artistName: true
      })
      .get({
        success: res => {
          //输出一下看书否获取到了默认歌曲，值在res.data中
          //因为是按照属性进行筛选，所以返回的是一个集合，我们自己知道只有一个记录
          //所以要的是这个数据集合的第一条，也就是res.data[0]
          console.log("getdefault", res);
          console.log("data[0]", res.data[0]);

          (this.globalData.playState = res.data[0].playState),
            (this.globalData.musicPic = res.data[0].musicPic),
            (this.globalData.musicName = res.data[0].musicName),
            (this.globalData.musicUrl = res.data[0].musicUrl),
            (this.globalData.artistName = res.data[0].artistName);
          console.log("name", this.globalData.artistName);
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

  // insertDeafultMusic: function() {
  //   //将默认歌曲添加到云数据库
  //   const db = wx.cloud.database();
  //   //需要选择你自己建立的表
  //   db.collection("music_default").add({
  //     data: {
  //       playState: DEFAULT_MUSIC.playState,
  //       musicPic: DEFAULT_MUSIC.musicPic,
  //       musicName: DEFAULT_MUSIC.musicName,
  //       musicUrl: DEFAULT_MUSIC.musicUrl,
  //       artistName: DEFAULT_MUSIC.artistName
  //     },
  //     success: res => {
  //       //在返回结果中会包含新创建的记录的_id
  //       this.setData({
  //         counterId: res._id,
  //         count: 1
  //       });
  //       wx.showToast({
  //         title: "插入默认信息成功"
  //       });
  //       console.log("[数据库][新增记录]成功，记录_id:", res._id);
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: "none",
  //         title: "新增记录失败"
  //       });
  //       console.error("[数据库][新增记录]失败:", err);
  //     }
  //   });
  // },
  globalData: {
    userInfo: null,
    audio: wx.createInnerAudioContext(),
    // playState: DEFAULT_MUSIC.playState,
    // musicPic: DEFAULT_MUSIC.musicPic,
    // musicName: DEFAULT_MUSIC.musicName,
    // musicUrl: DEFAULT_MUSIC.musicUrl,
    // artistName: DEFAULT_MUSIC.artistName,

    playState: null,
    musicPic: null,
    musicName: null,
    musicUrl: null,
    artistName: null,

    // musicPlayer: null,
    favorMusics: {}
  }
});
