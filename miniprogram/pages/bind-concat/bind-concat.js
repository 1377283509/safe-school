const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("user");
Page({
  data: {
    openId:undefined,
    name:undefined,
    phone:undefined,
    concat_openId:undefined,
    buttonLoading:false
  },

  onSave(){
    var {name,phone,concat_openId} = this.data;
    if(name == "" || name == undefined){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }
    if(phone == "" || phone == undefined){
      wx.showToast({
        title: '请输入电话',
        icon:"none"
      })
      return;
    }
    if(concat_openId == "" || concat_openId == undefined){
      wx.showToast({
        title: '请输入OpenId',
        icon:"none"
      })
      return;
    }
    this.setData({
      buttonLoading:true
    })
    collection.where({
      _openid:this.data.openId
    }).update({
      data:{
        concat:{
          name:name,
          phone:phone,
          openId:concat_openId
        },
      },
      complete:res=>{
        this.setData({
          buttonLoading:false
        })
      },
      success:res=>{
        wx.redirectTo({
          url: '../result-page/result-page?status=0&text=联系人信息保存成功',
        })
      },
      fail:res=>{
        wx.redirectTo({
          url: '../result-page/result-page?status=1&text=联系人信息保存失败',
        })
      }
    })
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '绑定紧急联系人',
    })
    var user = app.globalData.userInfo;
    if(user.concat){
      this.setData({
        openId:user._openid,
        name:user.concat.name,
        phone:user.concat.phone,
        concat_openId:user.concat.openId,
        hasBinded:true
      })
    }
  },

  onInputName(e){
    this.setData({
      name:e.detail
    })
  },

  onInputPhone(e){
    this.setData({
      phone:e.detail
    })
  },

  onInputOpenId(e){
    this.setData({
      concat_openId:e.detail
    })
  }

  


})