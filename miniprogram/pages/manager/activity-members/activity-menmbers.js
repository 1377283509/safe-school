const db = wx.cloud.database({env:"safe-school-xlcld",});
const userCollection = db.collection("user");
const regCollection = db.collection("user-activity");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    isLoading:true,
  },

  // 获取数据
  getData(activity_id){
    // 获取用户列表
    regCollection.where({
      activity:activity_id
    }).field({
      user:true
    }).get().then(res=>{
      let list = [];
      res.data.map(m=>{
        list.push(m.user)
      })
      // 获取用户
      let _ = db.command;
      userCollection.where({
        _openid:_.in(list)
      }).field({
        name:true,
        phone:true,
        college:true,
      }).get().then(res=>{
        this.setData({
          dataList:res.data,
          isLoading:false
        })
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
  },

  onTapPhone(e){
    let {phone} = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
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