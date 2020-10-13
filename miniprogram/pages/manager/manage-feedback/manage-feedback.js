const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("feed-back");
const app = getApp()
const nums = app.globalData.amountOfDataPerPage;
Page({

  data: {
    active:0,
    dataList_1:[],
    dataList_2:[]
  },

  onChange(e){
    let {index} = e.detail;
    if(index == 0 & this.data.dataList_1.length == 0){
      this.getData();
    }
    if(index == 1 & this.data.dataList_2.length == 0){
      this.getData()
    }
    this.setData({
      active:index
    })
  },

  getData(){
    wx.showLoading({
      title: '努力加载中',
    })
    let active = this.data.active;
    collection.where({
      status: active != 0
    }).get().then(res=>{
        if(active == 0){
          this.setData({
            dataList_1:res.data
          })
        }else{
          this.setData({
            dataList_2:res.data
          })
        }
        wx.hideLoading({
          complete: (res) => {},
        })
      }
    ).catch(res=>{
      wx.showToast({
        title: '加载失败',
        icon:"none"
      })
    })
  },


  onLoad: function (options) {
    this.getData()
  },
})