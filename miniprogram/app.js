//app.js
App({
  globalData:{
    userInfo:undefined,
    // 学校名
    schoolName:"山西大同大学",
    // 校保卫处电话
    alarmNumbers:"123456",
    // 校医院电话
    emergencyNumbers:"654321",
    // 每页加载的数据量
    amountOfDataPerPage:10,
    // 心理咨询地点
    consultingSite:"心理咨询中心"
  },
  getUserInfo(){
    var db = wx.cloud.database({env:"safe-school-xlcld"});
    var userCollection = db.collection("user")
    // 获取用户openId
    wx.cloud.callFunction({
      name:"getOpenId",
      success:res=>{
        var openId = res.result.openId;
        userCollection.where({
          _openid:openId,
        }).get().then(res=>{
          // 无用户信息，重定向到认证页
          if(res.data.length == 0){
            wx.redirectTo({
              url: '../register/register?openId='+ openId,
            })
          }else{
            this.globalData.userInfo = res.data[0]
            // 账号不可用，导航到提示页
            if(!res.data[0].canUse){
              wx.redirectTo({
                url: '../result-page/result-page?status=1&text=当前帐号不可用，如有问题请联系管理员',
              })
            }
            if(res.data[0].authStatus==1){
              wx.redirectTo({
                url: '../result-page/result-page?status=1&text=身份审核中，审核结果请留意订阅消息',
              })
            }
            if(res.data[0].authStatus == 2){
              wx.redirectTo({
                url: '../register/register?message=由于\t\t'+res.data[0].authDesc+'\t\t导致审核未通过',
              })
            }
          }
        })
      },
      fail:res=>{
        console.log(res)
        wx.showToast({
          title: '数据获取失败',
          icon:"none"
        })
      }
    })
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
    wx.cloud.init({
        env:"safe-school-xlcld",
        traceUser: true,
      })
    }
    this.getUserInfo()
  },
})
