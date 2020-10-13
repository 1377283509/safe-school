const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("case");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    case:undefined,
    message:undefined,
    status:true,
  },

  // 受理回调
  onChangeStatus(){
    if(!this.data.message){
      wx.showToast({
        title: '请输入留言',
        icon:"none"
      })
      return;
    }
    wx.cloud.callFunction({
      name:"acceptCase",
      data:{
        id:this.data.case._id,
        message:this.data.message,
      },
      success:res=>{
        this.onLoad(this.data.case._id)
      },
      fail:res=>{
        wx.showToast({
          title: '操作失败',
          icon:"none"
        })
      }
    })
  },

  // 输入留言回调
  onInputMessage(e){
    this.setData({
      message:e.detail.trim()
    })
  },

  // 获取数据
  getData(id){
    wx.showNavigationBarLoading({
      complete: (res) => {},
    })
    collection.where({
      _id:id
    }).get().then(res=>{
      this.setData({
        case:res.data[0],
        status:res.data[0].status,
      })
      wx.hideNavigationBarLoading({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
  },

  // 点击电话回调
  onTapPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.case.phone,
    })
  },

  onLoad: function (options) {
    this.getData(options.id)
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