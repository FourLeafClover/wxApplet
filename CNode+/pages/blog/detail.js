let httpHelper = require('../../utils/httpHelper.js')
var WxParse = require('/../../modules/wxParse/wxParse.js');
Page({
    data: {
        detail: null,
        title: "",
    },
    onPullDownRefresh: function() {
        console.log("reload");
        this.loadData(this.data.detail.id);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.title
        }
    },
    onLoad: function(param) {
        this.setData({
            title: param.title
        });
        this.loadData(param.key);
    },
    loadData: function(id) {
        let that = this;
        httpHelper.get({
            url: `/topic/${id}`
        }, (result) => {
            if (result.success) {
                WxParse.wxParse('article', 'html', result.data.content, that, 5);
                that.setData({
                    detail: result.data
                })
            }
        })
    }
})