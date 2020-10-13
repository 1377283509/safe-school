const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("activity");
const regCollection = db.collection("user-activity");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:undefined,
    activity:undefined,
    curNums:0,
    message:undefined
  },

  // 获取数据
  getData(){
    wx.showNavigationBarLoading()
    collection.where({
      _id:this.data.id
    }).get().then(res=>{
      this.setData({
        activity:res.data[0]
      })
      this.getRegistedNums(res.data[0]._id);
      wx.hideNavigationBarLoading()
    }).catch(res=>{
      wx.showToast({
        title: '数据加载失败',
        icon:"none"
      })
    })
  },

    // 获取报名数
    getRegistedNums(id){
      regCollection.where({
         activity:id
       }).count().then(res=>{
         this.setData({
           curNums:res.total
         })
       })
     },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id})
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
    this.getData()
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