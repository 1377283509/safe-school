const db = wx.cloud.database({env:"safe-school-xlcld"});
const collection = db.collection("activity");
const regCollection = db.collection("user-activity");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId:undefined,
    activity:undefined,
    hasRegisted:false,
    curNums:0
  },
  // 报名回调
  onApply(){
    let openId = this.data.openId;
    wx.cloud.callFunction({
      name:"activityRegister",
      data:{
        id:this.data.activity._id,
        openId:openId
      },  
      success:res=>{
        console.log(res)
        wx.redirectTo({
          url: '../result-page/result-page?text=报名成功&status=0',
        })
      },
      fail:res=>{
        wx.showToast({
          title: '数据上传失败',
          icon:"none"
        })
      }
    })
  },

  // 获取报名信息
  getRegistedStatus(id,openId){
    regCollection.where({
      activity:id,
      user:openId
    }).get().then(res=>{
      this.setData({
        hasRegisted:res.data.length>0,
      })
    })
  },

  // 获取报名数
  getRegistedNums(id){
   regCollection.where({
      activity:id
    }).count().then(res=>{
      this.setData({
        curNums:res.total
      })
    })
  },

  // 获取活动信息和报名信息
  getActivityData(id,openId){
    collection.where({
      _id:id
    }).get().then(data=>{
      var activity = data.data[0];
      this.getRegistedStatus(activity._id,openId);
      this.getRegistedNums(activity._id);
      this.setData({
        activity:activity,
      })
    }).catch(data=>{
      wx.showToast({
        title: '加载失败',
        icon:"none"
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id} = options;
    let openId = app.globalData.userInfo._openid;
    this.setData({openId:openId});
    this.getActivityData(id,openId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
})