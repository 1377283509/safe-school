const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("case");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 时间
    date:"",
    // 家庭住址
    homeAddress:"",
    // 宿舍
    dormitory:"",
    // 身份证号
    idCardNum:"",
    // 案件简述
    desc:"",
  },

  showToast(text){
    wx.showToast({
      title: text,
      icon:"none"
    })
  },

  // 提交数据
  onSubmit(e){
    let {date,homeAddress,dormitory,idCardNum,desc} = this.data;
    if(date == ""){
     this.showToast("身份证号不正确")
      return;
    }
    if(homeAddress == ""){
      this.showToast("请填写家庭住址");
      return;
    }
    if(dormitory == ""){
      this.showToast("请填写宿舍地址");
      return;
    }
    if(desc == ""){
      this.showToast("请填写案件简述");
      return;
    }
    if(date == ""){
      this.showToast("请填写报案时间");
      return;
    }
    // 获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success:res=>{
        let user = res.data;
        let data = {
          name:user.name,
          no:user.no,
          college:user.college,
          class:user.class,
          idCardNum:idCardNum,
          homeAddress:homeAddress,
          dormitory:dormitory,
          date:date,
          desc:desc,
          status:false
        }
        // 上报
        collection.add({
          data:data,
          success:res=>{
            wx.redirectTo({
              url: '../result-page/result-page?text=上报成功,可到个人中心查看进度&status=0',
            })
          },
          fail:res=>{
            wx.showToast({
              title: '上报失败',
              icon:"none"
            })
          }
        })
      },
      fail:res=>{
        wx.showToast({
          title: '用户信息获取失败',
        })
      }
    })
  },

  onInputIdCardNum(e){
    this.setData({
      idCardNum:e.detail.trim()
    })
  },
  onInputHomeAddress(e){
    this.setData({
      homeAddress:e.detail.trim()
    })
  },
  onInputDormitory(e){
    this.setData({
      dormitory:e.detail.trim()
    })
  },
  onInputDesc(e){
    this.setData({
      desc:e.detail.trim()
    })

  },
  onInputDate(e){
    this.setData({
      date:e.detail.trim()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '在线报案',
    })
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