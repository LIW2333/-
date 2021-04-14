// pages/post/post.js
const app = getApp();
let time = require("../../utils/util.js");
var countdown = 60;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    skin: app.globalData.skin,
    style: app.globalData.highlightStyle,
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    CommentShow: false,
    ButtonTimer: "", //  按钮定时器
    LastTime: 60,
    CommentSwitch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var postId = options.postId;
    // console.log(postId);
    this.setData({
      postId: postId
    });
    this.loadItem();
    this.loadComment();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.warn(app.globalData.userInfo);

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // console.warn(this.data.postId);
    return {
      title: this.data.postTitle,
      // path: '/pages/post/post?postId=' + this.data.postId,
      imageUrl: this.data.postThumbnail
    };
  },

  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo;
    // app.globalData.nickName = e.detail.userInfo.nickName;
    // app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },

  /**
   * 文章详情请求
   */
  loadItem: function() {
    console.log(app.globalData.getUserInfo)
    const db = wx.cloud.database();
    db.collection("post_list")
      .where({
        postid: this.data.postId
      })
      .get({
        success: res => {
          // console.log("success");
          // console.log(res.data);
          this.setData({
            postTitle: res.data[0].title,
            postVisits: res.data[0].visits,
            postLikes: res.data[0].likes,
            postContent: res.data[0].content,
            postDate: time.customFormatTime(res.data[0].time, "Y-M-D")
            // postTags: res.data.tags,
            // postThumbnail: res.data.thumbnail
          });
          // console.log(res.data);
        },
        fail: err => {
          wx.showToast({
            title: "页面不存在"
          });
          consol.error("[database][open] fail", err);
        }
      });
  },

  /**
   * 评论列表请求
   */
  loadComment: function() {
    var that = this;
    // console.warn(res.data);
    const db = wx.cloud.database();
    db.collection("post_comment")
      .where({
        postid: that.data.postId
      })
      .get({
        success: res => {
          // console.log("success");
          // console.log(res.data);
          that.setData({
            commentList: res.data
          });
          var list = res.data;
          // console.log(res.data);
        },
        fail: err => {
          wx.showToast({
            title: "页面不存在"
          });
          consol.error("[database][open] fail", err);
        }
      });

    // for (let i = 0; i < list.length; ++i) {
    // //   list[i].createTime = time.customFormatTime(
    // //     list[i].createTime,
    // //     "Y-M-D  h:m:s"
    // //   );
    //   list[i].falg = true;
    //   if (list[i].isAdmin) {
    //     list[i].email = "";
    //     list[i].authorUrl =
    //       "https://cn.gravatar.com/avatar/3958035fa354403fa9ca3fca36b08068?s=256&d=mm";
    //   }
    // }

    // list[list.length - 1].falg = false;
    // that.setData({
    //   commentList: res.data.content
    // });
  },

  /**
   * 评论模块
   */
  Comment: function(e) {
    var content = e.detail.value.replace(/\s+/g, "");
    // console.log(content);
    var that = this;
    that.setData({
      CommentContent: content
    });
  },

  CommentSubmit: function(e) {
    // console.log(app.globalData.userInfo);
    var that = this;

    if (!that.data.CommentContent) {
      wx.showToast({
        title: "评论内容不能为空！",
        icon: "none",
        duration: 2000
      });
      // console.error("评论内容为空!");
    } else {
      that.setData({
        CommentShow: true
      });
      that.data.ButtonTimer = setInterval(function() {
        if (countdown == 0) {
          that.setData({
            CommentShow: false
          });
          countdown = 60;
          clearInterval(that.data.ButtonTimer);
          return;
        } else {
          that.setData({
            LastTime: countdown
          });
          // console.warn(countdown);
          countdown--;
        }
      }, 1000);

      const db = wx.cloud.database();
      //需要选择你自己建立的表
      db.collection("post_comment").add({
        data: {
          postid: that.data.postId,
          author: app.globalData.userInfo.nickName,
          comment: this.data.CommentContent
        },
        success: res => {
          //在返回结果中会包含新创建的记录的_id
          // this.setData({
          //   counterId: res._id,
          //   count: 1
          // });
          wx.showToast({
            title: "评论成功"
          });
          console.log("[数据库][新增记录]成功，记录_id:", res._id);
          that.loadComment();
        },
        fail: err => {
          wx.showToast({
            icon: "none",
            title: "评论失败"
          });
          console.error("[数据库][新增记录]失败:", err);
        }
      });
      // console.warn(that.data.CommentContent);

      // var urlPostList = app.globalData.url + "/api/content/posts/comments";
      // var token = app.globalData.token;
      // var params = {
      //   author: app.globalData.userInfo.nickName,
      //   authorUrl: "https://github.com/aquanlerou/WeHalo",
      //   content: that.data.CommentContent,
      //   email: "aquanlerou@eunji.cn",
      //   parentId: 0,
      //   postId: that.data.postId
      // };

      //@todo 搜索文章网络请求API数据
      // request.requestPostApi(
      //   urlPostList,
      //   token,
      //   params,
      //   this,
      //   this.successSendComment,
      //   this.failSendComment
      // );
    }
  },

  CommentSubmitTips: function() {
    wx.showToast({
      title: this.data.LastTime + "s 后再次评论",
      icon: "none",
      duration: 1000
    });
  },

  Likes: function() {
    wx.showToast({
      title: "文章点赞功能开发中...",
      icon: "none",
      duration: 2000
    });
  },

  // successSendComment: function(res, selfObj) {
  //   var that = this;
  //   // console.warn(res.data);
  //   var token = app.globalData.token;
  //   var urlContent =
  //     app.globalData.url + "/api/content/posts/" + that.data.postId;
  //   var urlComments = urlContent + "/comments/list_view";
  //   var params = {};
  //   //@todo 评论列表网络请求API数据
  //   request.requestGetApi(
  //     urlComments,
  //     token,
  //     params,
  //     this,
  //     this.successComment,
  //     this.failComment
  //   );
  // },

  // failSendComment: function(res, selfObj) {
  //   console.error("failComment", res);
  // }

  /**
   * 评论开关按钮回调
   */
  // successSwitch: function(res, selfObj) {
  //   var that = this;
  //   // console.warn(res.data);
  //   that.setData({
  //     CommentSwitch: !res.data
  //   });
  // },
  // failSwitch: function(res, selfObj) {
  //   console.error("failSwitch", res);
  // }
});