const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("seek-help")
const userCollection = db.collection("user")
Page({

  data: {
    dataList:[],
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中',
    })
    // 加载求救信息
    collection.field({
      openId:true,
      date:true,
      name:true,
      phone:true
    }).get().then(res=>{
      var userList = [];
      for(var i=0;i<res.data.length;i++){
        userList.push(res.data[i].openId)
      }
      this.setData({
        dataList:res.data
      })
      wx.hideLoading({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据加载失败',
        icon:"none"
      })
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },
})