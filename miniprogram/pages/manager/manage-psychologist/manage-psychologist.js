const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("psychologist")
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    searchKey:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getData(){
    collection.field({
      name:true,
      phone:true,
      gender:true,
      status:true
    }).get().then(res=>{
      this.setData({
        list:res.data
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
  },

  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '心理医生管理',
    })
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