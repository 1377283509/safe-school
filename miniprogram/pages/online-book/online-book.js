const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("psychologist")

Page({

  data: {
    dataList:[],
    isLoading:true,
    option1:[
     {"text":"全部",value:"全部"},
     {"text":"男",value:"男"},
     {"text":"女",value:"女"},
    ],
    value1:"全部",
    option2:[
      {"text":"可预约",value:true},
      {"text":"不可预约",value:false},
    ],
    value2:true
  },

  refreshData(){
    if(this.data.value1 == "全部"){
      this.getAllData()
    }else{
      this.getPartData()
    }
  },

  onChangeGender(e){
   this.setData({
     value1:e.detail
   })
   this.refreshData()
  },

  onChangeStatus(e){
    this.setData({
      value2:e.detail
    })
    this.refreshData()
  },

  getPartData(){
    collection.where({
      status:this.data.value2,
      gender:this.data.value1
    }).get().then(res=>{
      this.setData({
        dataList:res.data,
        isLoading:false
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon: "none"
      })
    })
  },

  getAllData(){
    collection.where({
      status:this.data.value2
    }).get().then(res=>{
      this.setData({
        dataList:res.data,
        isLoading:false
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据获取失败',
        icon: "none"
      })
    })
  },

  onLoad: function (options) {
    this.setData({
      isLoading:true
    })
    this.refreshData()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
    wx.setNavigationBarTitle({
      title: '心理咨询预约',
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