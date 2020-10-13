const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("safety-loophole")
const app = getApp()

Page({
  data: {
    openid:undefined,
    dataList:[],
    isLoading:true,
    option1:[
     {"text":"全部",value:"全部"},
     {"text":"已处理",value:true},
     {"text":"未处理",value:false},
    ],
    value1:"全部",
  },

  // 刷新数据
  refreshData(){
    if(this.data.value1 == "全部"){
      this.getAllData()
    }else{
      this.getPartData()
    }
  },

  // 选择状态回调
  onChangeStatus(e){
    this.setData({
      value1:e.detail
    })
    this.refreshData()
  },

  // 获取部分数据
  getPartData(){
    collection.where({
      status:this.data.value1,
      _openid:this.data.openid
    }).field({
      address:true,
      status:true,
      type:true,
      description:true
    }).get().then(res=>{
      this.setData({
        dataList:res.data,
        isLoading:false
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon: "none"
      })
    })
  },

  // 获取全部数据
  getAllData(){
    collection.where({
      _openid:this.data.openid
    }).get().then(res=>{
      this.setData({
        dataList:res.data,
        isLoading:false
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon: "none"
      })
    })
  },

  onLoad: function (options) {
    var openid = app.globalData.userInfo._openid;
    this.setData({
      openid:openid,
    })
    this.refreshData()
  },

  onReady: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
    wx.setNavigationBarTitle({
      title: '我上报的隐患',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})