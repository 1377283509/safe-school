const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("psychologist")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:undefined,
    data:undefined
  },

  // 删除
  onDelete(){
    wx.showModal({
      cancelColor: '#515151',
      title:"确定要删除吗?",
      success:res=>{
        if(res.confirm){
          collection.doc(
            this.data.id
          ).remove().then(res=>{
            wx.navigateBack({
              complete: (res) => {
              },
            })
            wx.showToast({
              title: '删除成功!',
              icon:"none"
            })
          }).catch(res=>{
            wx.showToast({
              title: '删除失败',
              icon:"none"
            })
          })
        }
      }
    })
  },

  // 修改状态
  onChangeStatus(e){
    collection.where({
      _id:this.data.data._id
    }).update({
      data:{
        status:e.detail
      }
    }).catch(res=>{
    })
    this.getData()
  },

  getData(){
    collection.where({
      _id:this.data.id
    }).get().then(res=>{
      this.setData({
          data:res.data[0]        
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
    this.setData({
      id:options.id
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})