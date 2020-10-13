const db = wx.cloud.database({env:"safe-school-xlcld"});
const collection = db.collection("activity");
const regCollection = db.collection("user-activity");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    isLoading:true
  },

  // 获取我参加的活动ID列表
  getMyActivities(openId){
    regCollection.where({
      user:openId,
    }).field({
      activity:true
    }).get().then(res=>{
      let list = [];
      res.data.map(m=>{
        list.push(m.activity)
      })
      // 获取活动数据
      this.getActivitiesData(list)
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
      })
    })

  },

  // 根据活动Id列表获取活动数据
  getActivitiesData(idList){
    let _ = db.command;
    collection.where({
      _id:_.in(idList)
    }).field({
      title:true,
      address:true,
      startTime:true,
      message:true,
      status:true
    }).get().then(res=>{
      this.setData({
        list:res.data,
        isLoading:false,
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取openid
    wx.getStorage({
      key: 'userInfo',
      success:res=>{
        let openId = res.data._openid;
        // 获取活动情况
        this.getMyActivities(openId)
      }
    })

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