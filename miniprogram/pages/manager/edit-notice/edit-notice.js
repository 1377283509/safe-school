const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("activity");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:undefined,
    message:undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },

  // 输入回调
  onInputMessage(e){
    this.setData({message:e.detail.trim()})
  },

  // 发布回调
  onPublic(){
    console.log(this.data.message)
    collection.doc(this.data.id).update({
      data:{
        message:this.data.message,
      }
    }).then(res=>{
      wx.redirectTo({
        url: '../result-page/result-page?text=发布成功&status=0',
      })
    }).catch(res=>{
      console.log(res)
      wx.showToast({
        title: '发布失败',
        icon:"none"
      })
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