const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("functions");
const userCollection = db.collection("user");
Page({

  data: {
    userInfo:undefined,
    funcList:[
    ]
  },

  onLogout(){
    userCollection.doc(this.data.userInfo._id).remove({
    success:res=>{
      wx.showToast({
        title: '注销成功',
      })
      },
      fail:res=>{
        wx.showToast({
          title: '注销失败',
          icon:"none"
        }) 
      }
    })
  },

  onGetOpenId(){
    var openid = this.data.userInfo._openid;
    wx.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: openid,
      authContent: '请用验证身份',
      success:res=>{
        wx.setClipboardData({
          data: openid,
          success:res=>{
            wx.showToast({
              title: 'OpenId已复制',
            })
          }
        });
      },
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中',
    })
    var userInfo=app.globalData.userInfo;
    collection.where({
      page:"user-center"
    }).get().then(res=>{
      this.setData({
        userInfo:userInfo,
        funcList:res.data[0].menus
      })
      wx.hideLoading({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.showToast({
        title: '加载失败',
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