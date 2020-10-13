const db = wx.cloud.database({env:"safe-school-xlcld",});
const userCollection = db.collection("user");
const dateFormat = require("../../../utils/dateFormate.js")
Page({
  data: {
    user:undefined,
    isLoading:true,
    buttonLoading:false,
  },

  onChangeStatus(e){
    let user = this.data.user;
    user.authStatus = e.detail?0:2;
    this.setData({
      user:user
    })
  },

  // 输入回调
  onInput(e){
    var user = this.data.user;
    user.authDesc = e.detail;
    this.setData({
      user:user
    })
  },

  // 保存回调
  onSave(){
    this.setData({
      buttonLoading:true
    })
    var user = this.data.user
    wx.cloud.callFunction({
      name:"changeAuthStatus",
      data:{
        id:user._id,
        authDesc:user.authDesc,
        authStatus:user.authStatus
      },
      success:res=>{
        wx.showToast({
          title: '操作成功',
        })
        this.setData({
          buttonLoading:false
        })
        console.log(user._openid)
        wx.cloud.callFunction({
          name:"sendAuthInfo",
          data:{
            openId:user._openid,
            status:user.authStatus,
            date:dateFormat.toDate(Date.now(),"yyyy-MM-dd hh:mm")
          },
          success:res=>{
            console.log(res)
          }
        })
      },
      fail:res=>{
        wx.showToast({
          title: '操作失败',
          icon:"none"
        })
      }
    })
  },

  onTapImage(){
    var user = this.data.user
    wx.previewImage({
      urls: [user.imageUrl],
    })
  },   

  onLoad: function (options) {
    let {id} = options;
    userCollection.where({
      _id:id,
    }).get().then(res=>{
      this.setData({
        user:res.data[0]
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据加载失败',
        icon:"none"
      })
    })
  },
})