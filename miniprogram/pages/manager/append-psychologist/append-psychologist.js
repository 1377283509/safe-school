const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("psychologist")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    gender:"",
    phone:"",
    desc:"",
    freeTime:"",
    genders:["男","女"],
    showGenderPicker:false,
  },

  onAppend(e){
    let name = this.data.name;
    let gender = this.data.gender;
    let phone = this.data.phone;
    let freeTime = this.data.freeTime;
    let desc = this.data.desc;
    if(name == ""){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }

    if(gender == ""){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }

    if(phone == ""){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }

    if(freeTime == ""){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }
    if(desc == ""){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }
    collection.add({
      data:{
        name:name,
        gender:gender,
        phone:phone,
        freeTime:freeTime,
        desc:desc,
        status:true
      },
      success:res=>{
        wx.redirectTo({
          url: '../result-page/result-page?text=添加成功&status=0',
        })
      },
      fail:res=>{
        wx.showToast({
          title: '上传失败,请稍后重试',
          icon:"none"
        })
      }
    })
  },



  onInputPhone(e){
    this.setData({phone:e.detail.replace(/\s+/g,"")})
  },

  onInputName(e){
    this.setData({
      name:e.detail.replace(/\s+/g,"")
    })
  },

  onInputFreetime(e){
    this.setData({
      freeTime:e.detail
    })
  },

  onInputDesc(e){
    this.setData({
      desc:e.detail
    })
  },

  onConfirmGender(e){
  this.setData({
    gender:e.detail.value,
    showGenderPicker:false
  })
  },

  onCancel(){
    this.setData({
      showGenderPicker:false
    })
  },

  onSelectGender(){
    this.setData({
      showGenderPicker:true
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
      title: '添加心理咨询师',
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