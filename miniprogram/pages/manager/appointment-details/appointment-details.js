const db = wx.cloud.database({env:"safe-school-xlcld",});
const psyCollection = db.collection("psychologist")
const userCollection = db.collection("user")
const bookCollection = db.collection("psychologist-booked")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:undefined,
    psychologist:undefined,
    status:undefined
  },

  // 获取用户数据
  getUserData(id){
    userCollection.where({
      _openid:id
    }).field({
      name:true,
      college:true,
      class:true,
      phone:true,
      no:true
    }).get().then(res=>{  
        this.setData({
          user:res.data[0]
        })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
  },

  // 获取心理医生数据
  getPsychologistData(id){
    psyCollection.where({
      _id:id
    }).field({
      name:true,
      phone:true,
      freeTime:true,
      gender:true
    }).get().then(res=>{  
        this.setData({
          psychologist:res.data[0]
        })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
  },

  // 获取预约数据
  getAppointment(id){
    bookCollection.where({
      _id:id,
    }).get().then(res=>{
      let userId = res.data[0]._openid;
      let psychologistId = res.data[0].psychologist;
      this.getUserData(userId);
      this.getPsychologistData(psychologistId);
      this.setData({
        status:res.data[0].status
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAppointment(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '心理咨询预约详情',
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