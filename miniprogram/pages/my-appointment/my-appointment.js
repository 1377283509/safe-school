const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("psychologist")
const bookCollection = db.collection("psychologist-booked")
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data:undefined,
    showTip:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */

   onTapPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.data.phone,
    })
   },

   getData(){
     var openid = app.globalData.userInfo._openid;
    bookCollection.where({
      status:false,
      _openid:openid
    }).get().then(res=>{
      console.log(res)
      let id = res.data[0].psychologist;
      collection.where({
        _id:id
      }).field({
        name:true,
        gender:true,
        phone:true,
        freeTime:true
      }).get().then(result=>{
        console.log(result)
        this.setData({
            data:result.data[0],
            showTip:res.data.length==0,
        })
        wx.hideLoading({
        })
      }).catch(res=>{
        wx.showToast({
          title: '数据获取失败',
          icon:"none"
        })
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
   },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我预约的心理咨询',
    })
    wx.showLoading({
      title: "努力加载中",
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