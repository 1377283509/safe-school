const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("psychologist")
const bookCollection = db.collection("psychologist-booked")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    collection.where({
      _id:id
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

  // 预约
  book(){
    bookCollection.get().then(res=>{
      if(res.data.length>0){
        wx.showToast({
          title: '存在未完成的咨询,不可预约',
          icon:"none"
        })
      }else{
        let id = this.data.data._id;
        bookCollection.add({
          data:{
            psychologist:id,
            status:false
          },
          success:res=>{
            wx.navigateTo({
            url: '../result-page/result-page?status=0&text=预约成功，请留意微信消息',
          })
          },
          fail:res=>{
            wx.showToast({
            title: '数据上传失败',
            icon:"none"
          })
        }
      })
      }
    })
  },  

  // 点击预约回调
  onTapBook(){
    wx.showModal({
      cancelColor: '#515151',
      title:"确认预约吗？",
      content:"一但预约将不可取消,请及时到"+app.globalData.consultingSite+"进行咨询。",
      success:res=>{
        if(res.confirm){
            this.book()
        }
      },
      fail:res=>{
        wx.showToast({
          title: res,
          icon:"none"
        })
      }
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