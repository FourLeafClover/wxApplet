let apiService = require('../../utils/apiService.js')
var WxParse = require('/../../modules/wxParse/wxParse.js');
Page({
    data: {
        detail: null,
        title: "",
        replies: []
    },
    onPullDownRefresh: function() {
        this.loadData(this.data.detail.id);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.title
        }
    },
    onLoad: function(param) {
        this.setData({
            title: decodeURI(param.title)
        });
        this.loadData(param.key);
    },
    loadData: function(id) {
        let that = this;
        apiService.get({
            url: `/topic/${id}`,
            param: {
                mdrender: true
            }
        }, (result) => {
            if (result.success) {
                WxParse.wxParse('article', 'html', result.data.content, that, 5);
                that.setData({
                    detail: result.data
                });
            }
        })
    },
    loadReplies: function() {
        let that = this;
        apiService.get({
            url: `/topic/${this.data.detail.id}`,
            param: {
                mdrender: false
            }
        }, (result) => {
            if (result.success) {
                that.setData({
                    replies: result.data.replies
                });
            }
        })
    }
})