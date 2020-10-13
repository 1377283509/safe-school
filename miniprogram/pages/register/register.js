const db = wx.cloud.database({env:"safe-school-xlcld",});
const collegeCollection = db.collection("college");
const userCollection = db.collection("user");
Page({
  data: {
    openId:"",
    message:"检测到当前微信未绑定用户信息，需绑定身份继续使用。"
  },  

  onTapButton(e){
    let {tag} = e.currentTarget.dataset;
    if(tag == 0){
      wx.navigateTo({
        url: '../stu-register/stu-register?openId='+this.data.openId,
      })
    }else if(tag==1){
      wx.navigateTo({
        url: '../tea-register/tea-register?openId='+this.data.openId,
      })
    }else{
      wx.navigateTo({
        url: '../experience/experience?openId='+this.data.openId,
      })
    }
  },

  onLoad: function (options) {
      let {message} = options;
      // 获取用户openId
      wx.cloud.callFunction({
        name:"getOpenId",
        success:res=>{
          if(message){
            this.setData({
              openId:res.result.openId,
              message:message
            })
          }else{
            this.setData({
              openId:res.result.openId
            })
          }
        },
        fail:res=>{
          wx.showToast({
            title: '数据获取失败',
            icon:"none"
          })
        }
      })
    wx.setNavigationBarTitle({
      title: '身份绑定',
    });
  },  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
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