const db = wx.cloud.database({env:"safe-school-xlcld",});
const psyCollection = db.collection("psychologist")
const userCollection = db.collection("user")
const bookCollection = db.collection("psychologist-booked")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:true,
    userList:[],
    psychologistList:[],
    appointmentList:[]
  },

  // 获取用户信息
  getUserInfo(idList){
    var _ = db.command;
    userCollection.where({
      _openid:_.in(idList)
    }).field({
      name:true,
      college:true,
    }).get().then(res=>{
      this.setData({
        userList:res.data
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
  },

  // 获取心理医生数据
  getPsychologistInfo(idList){
    var _ = db.command;
    psyCollection.where({
      _id:_.in(idList)
    }).field({
      name:true,
      phone:true
    }).get().then(res=>{
      this.setData({
        psychologistList:res.data
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon:"none"
      })
    })
  },

  // 获取预约数据
  getAppointmentData(){
    bookCollection.get().then(res=>{
      var users = [];
      var psychologists = [];
      res.data.map(m=>{
        users.push(m._openid);
        psychologists.push(m.psychologist);
      })
      this.getUserInfo(users);
      this.getPsychologistInfo(psychologists);
      this.setData({
        appointmentList:res.data,
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
    this.getAppointmentData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '心理咨询预约管理',
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