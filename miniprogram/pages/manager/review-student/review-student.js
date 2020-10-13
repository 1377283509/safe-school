const db = wx.cloud.database({env:"safe-school-xlcld",});
const userCollection = db.collection("user");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    dataList_1:[],
    dataList_2:[]
  },
//  标签状态改变回调
  onChange(e){
    let {index} = e.detail;
    if(index == 0 & this.data.dataList_1.length == 0){
      this.getDataList1();
    }
    if(index == 1 & this.data.dataList_2.length == 0){
      this.getDataList2()
    }
    this.setData({
      active:index
    })
  },

  // 获取待审核数据
  getDataList1(){
    userCollection.where({
      authStatus:1,
      tag:"student"
    }).field({
      _id:true,
      name:true,
      no:true,
      authStatus:true
    }).get().then(res=>{
      this.setData({
        dataList_1:res.data
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
  },

  // 获取已审核数据
  getDataList2(){
    userCollection.where({
      authStatus:0,
      tag:"student"
    }).field({
      _id:true,
      name:true,
      no:true,
      authStatus:true
    }).get().then(res=>{
      this.setData({
        dataList_2:res.data
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
  },

  onLoad: function (options) {
    this.getDataList1();
  },

  onPullDownRefresh(){
    var index = this.data.active
    if(index == 0){
      this.getDataList1();
    }
    if(index == 1){
      this.getDataList2()
    }
  }
})