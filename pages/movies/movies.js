var app = getApp();
var util = require('../../utils/utils.js');

Page({
    data: {
        movies: {},
        inTheater: {},
        comingSoon: {},
        top250: {},
        containerShow: true,
        searchPanelShow: false,
        onReachBottom: false,
        searchResclt: {},
        text: '',
        requestUrl: "",
        totalCount: 0,
        isEmpty: true
    },
    onLoad: function (event) {
        var inTheaterUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250 = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieListData(inTheaterUrl, "inTheater", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250, "top250", "豆瓣Top250");
    },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;    //获取data-category监听事件传过来的值category包含的。。。
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },
    onMaovieTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: "movie-detail/movie-detail?Id=" + movieId
        })
    },

    getMovieListData: function (url, setkey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            // http://t.yushu.im
            method: "GET",
            header: {
                "Content-Type": "json"
            },
            success: function (res) {
                // console.log(res.data);
                that.processDoubanData(res.data, setkey, categoryTitle);

            },
            fail: function (error) {
                console.log(error)
            }
        });
    }
    ,

    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            onReachBottom: false,
            searchResclt: {},
            text: ''
        })
    }
    ,

    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true,
            onReachBottom: true
        })
    }
    ,


    onBindChange: function (event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResclt", "");
        this.data.requestUrl = searchUrl;
        util.http(searchUrl, this.processDoubanData);
    }
    ,
//在同级的搜索框页面下不要用onReachBottom用onScrollLower,
//一般都是用上拉加载的功能多，由于用onScrollLower就是不用能下拉刷新功能，所以自己看需求来
    onScrollLower: function (event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    }
    ,
    processDoubanData: function (moviesDouban, setkey, categoryTitle) { //moviesDouban是res.data接收传参名字，setkey是接收data下的三个key。
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
            }
            movies.push(temp)
        }
        var readyData = {};
        readyData[setkey] = {
            categoryTitle: categoryTitle,
            movies: movies
        }
        this.setData(readyData);


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
    }
});