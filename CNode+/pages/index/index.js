//index.js
//获取应用实例
var app = getApp()
var apiService = require('../../utils/apiService.js')
Page({
    data: {
        curTag: null,
        tags: [{
            key: "",
            value: "全部"
        }, {
            key: "good",
            value: "精华",
        }, {
            key: "share",
            value: "分享"
        }, {
            key: "job",
            value: "招聘"
        }, {
            key: "ask",
            value: "问答"
        }],
        items: [],
        isOpenTagList: false,
        scrollTop: 0,
        pageInfo: {
            pageSize: 20,
            pageIndex: 0
        },
        hasLoadAll: false,
        isShowLoading: true,
        systemInfo: wx.getSystemInfoSync(),

    },
    onPullDownRefresh: function () {
        this.reflesh();
    },
    onShareAppMessage: function () {
        return {
            title: this.data.title
        }
    },
    reflesh: function (event) {
        this.setData({
            isHideRefresh: false,
            pageInfo: {
                pageSize: 20,
                pageIndex: 0
            },
            hasLoadAll: false,
            scrollTop: 0
        })
        let that = this;
        this.data.items = [];
        this.loadData(true);
    },
    getNextPage: function (event) {
        if (!this.data.hasLoadAll) {
            this.data.pageInfo.pageIndex += this.data.pageInfo.pageIndex + 1;
            this.loadData(false);
        }
    },
    onLoad: function () {
        let that = this;
        this.setData({
            curTag: this.data.tags[0]
        });
        this.loadData();
    },
    getApiData: function (event) {
        let that = this;
        let curTag = event.currentTarget.dataset.tag;
        this.setData({
            curTag: curTag,
            isOpenTagList: false
        });
        this.reflesh();
    },
    getTabCHNName: function (item) {
        if (item.top) {
            return "置顶"
        }
        if (item.good) {
            return "精华";
        };
        for (let index = 0; index < this.data.tags.length; index++) {
            if (this.data.tags[index].key == item.tab) {
                return this.data.tags[index].value;
            }
        }
    },
    openTagList: function () {
        this.setData({
            isOpenTagList: !this.data.isOpenTagList
        })
    },
    goToDetailPage: function (event) {
        let id = event.currentTarget.dataset.id;
        let title = event.currentTarget.dataset.title;
        wx.navigateTo({
            url: `../blog/detail?key=${id}&title=${title}`
        })
    },
    //获取数据
    loadData: function (isShowLoading = true, beforePushDataCallback = null) {
        if (isShowLoading) {
            this.setData({
                isShowLoading: true
            })
        }
        let that = this;
        apiService.get({
            url: "/topics",
            param: {
                tab: that.data.curTag.key,
                page: that.data.pageInfo.pageIndex,
                limit: that.data.pageInfo.pageSize,
                mdrender: false,
            },
        }, (result) => {

            this.setData({
                isShowLoading: false
            });

            if (result.data) {

                if (result.data.length < that.data.pageInfo.pageSize) {
                    that.setData({
                        hasLoadAll: true,
                    })
                }

                if (beforePushDataCallback) {
                    beforePushDataCallback();
                }

                result.data.map((item) => {
                    item.tab = that.getTabCHNName(item);
                    that.data.items.push(item);
                });

                that.setData({
                    items: that.data.items
                })
            }
        });
    }
})