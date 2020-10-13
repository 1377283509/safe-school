const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("functions");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 紧急功能
    funcList1:[
    ],
    // 基础功能
    funcList2:[
    ],
    // 管理员功能
    funcList3:[
    ],
  },

  openMap(){
    wx.navigateTo({
      url: '../track-position-page/track-position-page',
    })
  },

  // 校保卫处
  callToSecurityOffice(){
    let phone = app.globalData.alarmNumbers;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  // 校医院
  callToHosptiol(){
    let phone = app.globalData.emergencyNumbers;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  navToFunc(e){
    let {path} = e.currentTarget.dataset;
    wx.navigateTo({
      url: path,
    })
  },

  onLoad: function (options) {
    wx.showLoading({
      title:"努力加载中"
    })
    // 判断用户认证状态和是否是管理员
    var admin = app.globalData.userInfo.admin;
    var _ = db.command;
    collection.where({
      page:"funcs",
      admin:_.lte(admin)
    }).get().then(res=>{
      var funcList1 = [];
      var funcList2 = [];
      var funcList3 = [];
      for(var i=0;i<res.data.length;i++){
        if(res.data[i].type == "manage"){
          if(res.data[i].admin == 1 && admin !=1){
            continue;
          }
          funcList3 = funcList3.concat(res.data[i].menus) 
          continue;
        }
        if(res.data[i].type == "base"){
          funcList2 = res.data[i].menus;
          continue;
        }
        if(res.data[i].type == "instant"){
          funcList1 = res.data[i].menus;
          continue;
        }
      }
      this.setData({
        funcList1:funcList1,
        funcList2:funcList2,
        funcList3:funcList3
      })
      wx.hideLoading({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.hideLoading({
      })
      wx.showToast({
        title: '加载失败',
        icon:"none"
      })
    })
  },

  onShow: function () {
  },
})