const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("activity")

Page({
  data: {
    dataList:[],
    isLoading:true,
    option1:[
     {"text":"全部",value:"全部"},
     {"text":"筹备中",value:true},
     {"text":"已结束",value:false},
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
    }).field({
      title:true,
      status:true,
      startTime:true,
      publisher:true
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
    collection.get().then(res=>{
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
    this.setData({
      isLoading:true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
    wx.setNavigationBarTitle({
      title: '案件管理',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refreshData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})