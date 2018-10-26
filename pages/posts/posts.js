var postsData = require('../../data/posts-data.js')
Page({
  data: {

  },
  onLoad: function () {
    // 生命周期函数--监听页面加载1

    // this.data.postList = postsData.postList;
    this.setData({
      posts_key: postsData.postList
    });
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '../posts/posts-detail/posts-detail?id=' + postId

    })
  },
  // onSwiperItemTap: function(event) {
  //   var postId = event.currentTarget.dataset.postid;
  //   wx.navigateTo({
  //     url: '../posts/posts-detail/posts-detail?id=' + postId

  //   })
  // }
  onSwiperTap: function (event) {
    // target 和 currentTarget 
    // target指的是当前点击的组件  而  getCurrentTarget 指的是事件捕获的组件
    // target这里指的是image   而 currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: '../posts/posts-detail/posts-detail?id=' + postId

    })
  }
})