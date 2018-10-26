var app = getApp();
var util = require("../../../utils/utils.js");

Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category; //将category获取到的导航条内容赋予data下设置为空的navigateTitle里。
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },
  //上拉加载更多
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  //下拉刷新
  // onPullDownRefresh: function(event) {
  //   var refreshshUrl = this.data.requestUrl + "?star=0&count=20";
  //   this.data.movies = {};
  //   this.data.isEmpty = true;
  //   util.http(refreshshUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading();
  // },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]; //等于将res.data取到的豆瓣api下的选择的三条数据赋给subject [idx]是将数据给获取的给不展开来
      var title = subject.title; //获取api下的title数据赋予到新的title上
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.StarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    var totalMovies = {};
    // 如果要绑定心加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  //导航条标题动态获取
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });
  },
  onMaovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  }
});