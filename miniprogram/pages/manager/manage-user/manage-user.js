const db = wx.cloud.database({env:"safe-school-xlcld",});
const userCollection = db.collection("user");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    offset:0,
  },

  onSearch(e){
    let no = e.detail;
    wx.navigateTo({
      url: '../search-user-result/search-user-result?no='+no,
    })
  },

  // 修改用户状态
  onChangeStatus(e){
    let {id} = e.currentTarget.dataset;
    let status = e.detail;
    var list = this.data.dataList;
    // 修改本地状态
    for(var i=0;i<list.length; i++){
      if(list[i]._id == id){
        list[i].canUse = status;
      }
    }
    this.setData({
      dataList:list
    })
    // 修改数据库状态
    wx.cloud.callFunction({
      name:"changeUserStatus",
      data:{
        id:id,
        status:status
      }
    }).then(res=>{
      wx.showToast({
        title: '操作成功',
      })
    }).catch(e=>{
      wx.showToast({
        title: '操作失败',
        icon:"none"
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({});
    userCollection.field({
      _id:true,
      name:true,
      no:true,
      canUse:true,
    }).get().then(res=>{
      this.setData({
        dataList:res.data
      })
      wx.hideLoading({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据加载失败',
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