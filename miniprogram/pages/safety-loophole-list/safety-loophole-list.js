const db = wx.cloud.database({env:"safe-school-xlcld",});
const collections = db.collection("safety-loophole");
const nums = 10;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading:true,
    safety_loophole_list:[],
    offset:0,
    showBottom:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getData(){
    this.setData({isLoading:true,showBottom:false})
    collections
    .where({"status":false})
    .skip(this.data.offset)
    .limit(nums)
    .get()
    .then(res=>{
      let list = res.data;
      let show = res.data.length<nums;
      let new_list = this.data.safety_loophole_list.concat(list)
      this.setData({
        safety_loophole_list:new_list,
        offset:this.offset+list.length,
        isLoading:false,
        showBottom:show
      })
      wx.hideNavigationBarLoading({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.showToast({
        title: "数据加载失败",
        icon:"none"
      })
    });
  },


  onLoad: function (options) {
    wx.showNavigationBarLoading({
      complete: (res) => {},
    })
    wx.setNavigationBarTitle({
      title: '安全隐患',
    });
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
    collections.where({
      
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})