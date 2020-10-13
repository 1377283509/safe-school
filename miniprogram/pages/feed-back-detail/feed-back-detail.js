const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("feed-back");
const userCollection = db.collection("user");
Page({
  data: {
    data:undefined,
    user:undefined
  },

  getData(id){
    wx.showLoading({
      title: '努力加载中',
    })
    // 加载反馈信息
    collection.where({
      _id:id
    }).get().then(res=>{
      userCollection.where({
        _openid:res.data[0]._openid
      }).field({
        name:true,
        no:true
      }).get().then(r=>{
        this.setData({
          data:res.data[0],
          user:r.data[0]
        })
      })
      wx.hideLoading({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.showToast({
        title: '加载失败',
        icon:"none"
      })
    })
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '反馈详情',
    })
    this.getData(options.id)
  },
})