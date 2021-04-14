// component/songItem/songItem.js
var app = getApp();
Component({
  /**
   * Component properties
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    singer: {
      type: String,
      value: {}
    }
  },

  /**
   * Component initial data
   */
  data: {
    favor: false,
    counterId: null
  },

  lifetimes: {
    //组件所在页面的生命周期函数
    attached: function() {
      // let states = app.globalData.favorMusics;
      // let index = this.properties.item.id;
      // this.setData({
      //   favor: states.musics[index],
      //   counterId: states.counterIds[index]
      // })
      // console.log("aaaa");
      console.log(this.properties.item.id);
      const db = wx.cloud.database();
      db.collection("music_favor")
        .where({
          id: this.properties.item.id
          // _id: true
        })
        .get({
          success: res => {
            console.log("--------")
            console.log(res)
            if (res.data.length === 0) {
              this.setData({
                favor: false
              });
            } else {
              this.setData({
                favor: true,
                counterId: res.data[0]._id,
              });
            }
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
    // ready: function(){
    //     // console.log("aaa")
    // } 
  },

  // ready: function () {
  //   console.log(this.properties.item, this.properties.singer);
  // },

  /**
   * Component methods
   */
  methods: {
    handleClick: function() {
      var musicPlayer = app.globalData.player;
      //console.log(musicPlayer.data)
      //更新全局播放器变量的数据
      app.globalData.playState = 1;
      app.globalData.musicPic = this.properties.item.poster;
      app.globalData.musicName = this.properties.item.name;
      app.globalData.musicUrl = this.properties.item.src;
      app.globalData.artistName = this.properties.singer;
      //同步当前页播放器的数据
      musicPlayer.setData({
        playState: app.globalData.playState,
        musicPic: app.globalData.musicPic,
        musicName: app.globalData.musicName,
        musicUrl: app.globalData.musicUrl,
        artistName: app.globalData.artistName
      });

      //console.log(musicPlayer.data).
      //数据更新完毕，切换歌曲
      musicPlayer.change();
    },
    handleFavor: function() {
      this.setData({
        favor: !this.data.favor
      });
      console.log(this.data.favor);
      if (this.data.favor) {
        this.favorMusic();
      } else {
        this.disfavorMusic();
      }
    },
    //收藏音乐，添加到云数据库
    favorMusic: function() {
      const db = wx.cloud.database();
      console.log(db);
      db.collection("music_favor").add({
        data: {
          id: this.properties.item.id,
          name:this.properties.item.name,
          singer: this.properties.singer,
          poster:this.properties.item.poster,
          src: this.properties.item.src
        },
        success: res => {
          //在返回结果中会包含新创建的记录的_id
          this.setData({
            favor: true,
            counterId: res._id,
            // count: 1
          });
          wx.showToast({
            title: "已收藏"
          });
          console.log("[数据库][新增记录]成功，记录 _id:", res._id);

          // app.globalData.favorMusics.musics[this.properties.item.id] = true;
          // app.globalData.favorMusics.counterIds[
          //   this.properties.item.id
          // ] = this.data.counterId;
        },
        fail: err => {
          wx.showToast({
            icon: "none",
            title: "新增记录失败"
          });
          console.error("[数据库][新增记录]失败:", err);
        }
      });
    },
    //取消收藏音乐，从云数据库删除
    disfavorMusic: function() {
      console.log(this.data.counterId)
      if (this.data.counterId) {
        const db = wx.cloud.database();
        db.collection("music_favor")
          .doc(this.data.counterId)
          .remove({
            success: res => {
              wx.showToast({
                title: "已取消收藏"
              });
              this.setData({
                favor: false,
                counterId: "",
                // count: null
              });

              app.globalData.favorMusics.musics[
                this.properties.item.id
              ] = false;
              app.globalData.favorMusics.counterIds[
                this.properties.item.id
              ] = undefined;
            },
            fail: err => {
              wx.showToast({
                icon: "none",
                title: "删除失败"
              });
              console.error("[数据库][删除记录]失败:", err);
            }
          });
      } else {
        wx.showToast({
          title: "无counterId,该歌曲还未收藏"
        });
      }
    }
  }
});
