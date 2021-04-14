// component/musicPlayer/musicPlayer.js
var app = getApp();

Component({
  /**
   * Component properties
   */
  properties: {},

  /**
   * Component initial data
   */
  data: {
    playState: app.globalData.playState,
    musicPic: app.globalData.musicPic,
    musicName: app.globalData.musicName,
    musicUrl: app.globalData.musicUrl,
    artistName: app.globalData.artistName
  },

  pageLifetimes: {
    show: function() {
      if (!app.globalData.musicName) {
        setTimeout(() => {
          this.updateData();
        }, 500);
      }
      this.updateData();
    },
    ready: function() {}
  },

  /**
   * Component methods
   */
  methods: {
    handleClick: function(e) {
      console.log(app.globalData.playState);
      switch (this.data.playState) {
        case 0:
          this.setData({
            playState: 1
          });
          this.play();
          break;
        case 1:
          this.setData({
            playState: 0
          });
          this.pause();
          break;
      }
    },
    play: function() {
      app.globalData.audio.play();
      app.globalData.playState = 1;
      this.setData({
        playState: 1
      });
    },
    pause: function() {
      app.globalData.audio.pause();
      app.globalData.playState = 0;
      this.setData({
        playState: 0
      });
    },
    change: function() {
      app.globalData.audio.src = app.globalData.musicUrl;
      app.globalData.playState = 1;
      this.setData({
        playState: 1
      });
      app.globalData.audio.play();
    },
    /**
     *更新自己的变量，更新视图
     */
    updateData() {
      this.setData({
        musicPic: app.globalData.musicPic,
        musicName: app.globalData.musicName,
        musicUrl: app.globalData.musicUrl,
        artistName: app.globalData.artistName,
        playState: app.globalData.playState
      });
      console.log(this.data.musicName);
    }
  }
});
