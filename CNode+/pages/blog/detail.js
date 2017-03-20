let httpHelper = require('../../utils/httpHelper.js')
var WxParse = require('../../modules/wxParse/wxParse.js');
Page({
    data: {
        detail: null,
        title: "",
    },
    onShareAppMessage: function () {
        return {
            title: this.data.title
        }
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function (param) {
        let that = this;
        httpHelper.get({
            url: `/topic/${param.key}`
        }, (result) => {
            if (result.success) {
                WxParse.wxParse('article', 'html', result.data.content, that, 5);
                that.setData({
                    detail: result.data,
                    title: param.title
                })
            }
        })
    }
})
