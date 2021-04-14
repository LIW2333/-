// pages/hot/hot.js
var musicList = require("../../source/musicList.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    musics: {},
    // song: {
    //   poster: "//y.gtimg.cn/music/photo_new/T002R300x300M0000014vcT105uLc8.jpg?max_age=2592000",
    //   name: "Aliez",
    //   author: "Sawano",
    //   src: "http://mp3.dwjgrw.cn/down/6466.mp3"
    // }
  },
  onLoad: function(options) {
    this.setData({
      lists: musicList.lists
    })
    console.log(musicList);
    console.log(this.data.lists)
  },
  onReady: function() {
    // this.audioCtx = wx.createAudioContext('myAudio')
  }
})