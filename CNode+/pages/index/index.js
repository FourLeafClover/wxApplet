//index.js
//获取应用实例
var app = getApp()
var httpHelper = require('../../utils/httpHelper.js')
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
        scrollTop: 200,
        pageInfo: {
            pageSize: 20,
            pageIndex: 0
        },
        hasLoadAll: false,
        isShowLoading: true,
        systemInfo: wx.getSystemInfoSync()
    },
    reflesh: function(event) {
        this.data.items = [];
        this.setData({
            isHideRefresh: false,
            pageInfo: {
                pageSize: 20,
                pageIndex: 0
            },
            hasLoadAll: false
        })
        let that = this;
        this.loadData();
    },
    getNextPage: function(event) {
        this.data.pageInfo.pageIndex += this.data.pageInfo.pageIndex + 1;
        this.loadData(false);
    },
    onLoad: function() {
        let that = this
        this.setData({
            curTag: this.data.tags[0]
        });
        this.loadData();
        console.log(this.data.systemInfo);
    },
    getApiData: function(event) {
        let that = this;
        let curTag = event.currentTarget.dataset.tag;
        this.setData({
            curTag: curTag
        });
        this.reflesh();
    },
    getTabCHNName: function(item) {
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
    openTagList: function() {
        this.data.isOpenTagList = !this.data.isOpenTagList
        this.setData({
            isOpenTagList: this.data.isOpenTagList
        })
    },
    goToDetailPage: function(event) {
        let id = event.currentTarget.dataset.id;
        let title = event.currentTarget.dataset.title;
        wx.navigateTo({
            url: `../blog/detail?key=${id}&title=${title}`
        })
    },
    //获取数据
    loadData: function(isShowLoading = true, callback) {
        if (isShowLoading) {
            this.setData({
                isShowLoading: true
            })
        }

        let that = this;
        httpHelper.get({
            url: "/topics",
            param: {
                tab: that.data.curTag.key,
                page: that.data.pageInfo.pageIndex,
                limit: that.data.pageInfo.pageSize,
                mdrender: false,
            },
        }, (result) => {
            if (result.data) {
                if (result.data.length < that.data.pageInfo.pageSize) {
                    that.setData({
                        hasLoadAll: true,
                    })
                }
                result.data.map((item) => {
                    item.tab = that.getTabCHNName(item);
                    that.data.items.push(item);
                });
                that.setData({
                    items: that.data.items,
                    isShowLoading: false
                })
            }
        });
    }
})