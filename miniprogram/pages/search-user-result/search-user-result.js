const db = wx.cloud.database({env:"safe-school-xlcld",});
const userCollection = db.collection("user");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:undefined,
    isLoading:true
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
    wx.showLoading({
    })
    let no = options.no;
    userCollection.where({
      no:no
    }).field({
      _id:true,
      name:true,
      no:true,
      canUse:true,
    }).get().then(res=>{
      this.setData({
        user:res.data[0],
        isLoading:false
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
})