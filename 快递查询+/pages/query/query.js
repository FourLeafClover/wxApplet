Page({
    data: {
        expressList: [
            {
                key: "shunfeng",
                name: "顺丰"
            }, {
                key: "zhongtong",
                name: "中通"
            }
        ],
        expressNumber: "",
        selectedExpress: null,
        infoList: []
    },
    //事件处理函数
    queryExpress: function () {
        
        let that = this;
        let errorMsg = "";
        if (that.data.selectedExpress == null) {
            errorMsg = "请选择物流公司";
        }
        if (that.data.expressNumber == "") {
            errorMsg = "请输入运单号";
        }

        if (errorMsg != "") {
            wx.showToast({
                title: errorMsg,
                icon: 'fail',
                duration: 2000
            });
            return;
        }

        var requestUrl = `http://m.kuaidi100.com/query?type=${that.data.selectedExpress.key}&postid=${that.data.expressNumber}&id=1&valicode=&temp=0.36890306987910864`;

        console.log(requestUrl);
        wx.request({
            url: requestUrl,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                var result = res.data;
                if (result.message == 'ok') {
                    that.setData({
                        infoList: result.data
                    })
                } else {
                    wx.showToast({
                        title: '查询失败',
                        icon: 'fail',
                        duration: 2000
                    });
                }
            }
        })
    },
    showTag: function () {
        let that = this;
        let itemList = [];
        this.data.expressList.map((item) => {
            itemList.push(item.name);
        });

        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                that.setData({
                    selectedExpress: that.data.expressList[res.tapIndex]
                })
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    inputExpressNumber: function (e) {
        this.setData({
            expressNumber: e.detail.value
        })
    },
    onLoad: function () {

    }
})