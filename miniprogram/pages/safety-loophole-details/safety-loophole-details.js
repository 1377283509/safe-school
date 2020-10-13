const db = wx.cloud.database({env:"safe-school-xlcld",});
const collections = db.collection("safety-loophole");
const userCollection = db.collection("user");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:undefined,
    imageList:undefined,
    isAdmin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '隐患详情',
    });
    var {id} = options;
    // 加载隐患信息
    collections.where({
      _id:id,
    }).get().then(res=>{
      var list = [];
      res.data[0].imageList.map(m=>{
        list.push(m.url)
      })
      var isAdmin = options.isAdmin === 'true';
      this.setData({item:res.data[0],imageList:list,isAdmin:isAdmin});
    }).catch(res=>{
      wx.showToast({
        title: '数据加载失败',
        icon:"none"
      })
    });
  },

  onTap(){
    wx.cloud.callFunction({
      name:"disposeSafetyLoophole",
      data:{
        id:this.data.item._id
      },
      success:res=>{
        wx.redirectTo({
          url: '../result-page/result-page?text=处理成功&status=0',
        })
      },
      fail:res=>{
        wx.showToast({
          title: '数据上报失败',
          icon:"none"
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})