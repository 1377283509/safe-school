const db = wx.cloud.database({env:"safe-school-xlcld"});
const collection = db.collection("activity");
const app = getApp()
const nums = app.globalData.amountOfDataPerPage;
Page({

  data: {
    activityList:[],
    isLoading:true,
    showBottom:false,
    offset:0
  },

  // 加载数据
   getData(){
    collection
    .where({
      status:true
    })
    .skip(this.data.offset)
    .limit(nums)
    .get()
    .then(res=>{
      let list = res.data;
      let show = res.data.length<nums;
      this.setData({
        activityList:this.data.activityList.concat(list),
        offset:this.data.offset+list.length,
        showBottom:show,
        isLoading:false});
        wx.hideNavigationBarLoading({
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
    wx.showNavigationBarLoading({
      complete: (res) => {},
    })
    wx.setNavigationBarTitle({
      title: '安全活动',
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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