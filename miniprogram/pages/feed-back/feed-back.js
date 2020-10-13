const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("feed-back");
const dateFormat = require("../../utils/dateFormate.js")

Page({

  data: {
    message:undefined,
    buttonLoading:false
  },

  onPublic(){
    if(this.data.message == "" || this.data.message == undefined){
      wx.showToast({
        title: '请输入内容',
        icon:"none"
      })
      return;                                                           
    }
    this.setData({
      buttonLoading:true
    })
    collection.add({
      data:{
        content:this.data.message,
        date:dateFormat.toDate(Date.now(),"yyyy-MM-dd hh:mm"),
        status:false
      },
      success:res=>{
        wx.redirectTo({
          url: '../result-page/result-page?status=0&text=反馈成功',
        })
      },
      fail:res=>{
        wx.showToast({
          title: '提交失败',
          icon:"none"
        })
      },
      complete:res=>{
          this.setData({
            buttonLoading:false
          })
      }
    })
  },

  onInputMessage(event){
    this.setData({
      message:event.detail
    })
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '反馈',
    })
  },

})