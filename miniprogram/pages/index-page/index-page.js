const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const articleCollection = db.collection("article")
const nums = app.globalData.amountOfDataPerPage;
Page({
  data: {
    isLoading:true,
    searchValue:undefined,
    articleList:[],
    offset:0,
    showBottom:false,
    menuList:[
      {
        "name":"热门活动",
        "icon":"cloud://safe-school-xlcld.7361-safe-school-xlcld-1301783820/iconicon/laba.png",
        "path":"../safety-activity-list/safety-activity-list"
      },
      {
        "name":"安全隐患",
        "icon":"cloud://safe-school-xlcld.7361-safe-school-xlcld-1301783820/iconicon/position.png",
        "path":"../safety-loophole-list/safety-loophole-list"
      },
      {
        "name":"紧急求救",
        "icon":"cloud://safe-school-xlcld.7361-safe-school-xlcld-1301783820/iconicon/location.png",
        "path":"../track-position-page/track-position-page"
      },
    ]
  },

  onPullDownRefresh(){
    this.setData({
      offset:0,
      articleList:[]
    })
    this.getData()
  },

  onSearch(e){
    console.log("搜索"+e.detail)
  },

  onChange(e){
    this.setData({
      searchValue:e.detail
    })
  },

  onClear(){
    this.setData({searchValue:""})
  },

  getData(){
    this.setData({isLoading:true,showBottom:false})
    articleCollection.orderBy('article','pubDate').skip(this.data.offset).limit(nums).get().then(res=>{
      let list = res.data;
      let show = list.length<nums;
      let articles = this.data.articleList.concat(list);
      this.setData({articleList:articles,offset:this.data.offset+list.length,showBottom:show,isLoading:false})
      wx.hideNavigationBarLoading({
        complete: (res) => {},
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据加载失败',
        icon:"none"
      })
    })
  },

  onLoad: function (options) {
    wx.showNavigationBarLoading({
      complete: (res) => {},
    })
    wx.setNavigationBarTitle({
      title: '平安校园'
    })
    this.getData()
  },


  onReachBottom(){
    this.getData()
  },

  ontapArticle(e){
    let {url} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../article-details/article-details?url='+url,
    })
  },
})