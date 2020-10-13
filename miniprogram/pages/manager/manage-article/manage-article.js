const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const articleCollection = db.collection("article")
const nums = app.globalData.amountOfDataPerPage;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    articleList:[],
    offset:0,
    isLoading:false,
    showBottom:false
  },

  onEdit(event){
    wx.navigateTo({
      url: '../public-article/public-article?id='+event.currentTarget.dataset.id,
    })
  },

  onDelete(event){
    let id =event.currentTarget.dataset.id;
    wx.showModal({
      cancelColor: 'grey',
      title:"确定要删除吗？",
      success:res=>{
        if(res.confirm){
          articleCollection.doc(id).remove({
            success:res=>{
             wx.showToast({
               title: '删除成功',
             })
             var list = this.data.articleList;
             var index;
             for(var i=0;i<list.length;i++){
                if(list[i]._id == id){
                  index = i;
                  break;
                }
             }
             list.splice(index,1)
             this.setData({
               articleList:list
             })
            },
            fail:res=>{
              wx.showToast({
                title: '删除失败',
                icon:"none"
              })
            }
          })
        }
      }
    })
  },
  
  // 加载数据
  getData(){
    wx.showNavigationBarLoading({
    })
    this.setData({isLoading:true,showBottom:false})
    articleCollection.orderBy('article','pubDate').field({
      _id:true,
      title:true,
      tag:true,
      organization:true,
      pubDate:true
    }).skip(this.data.offset).limit(nums).get().then(res=>{
      let list = res.data;
      let show = list.length<nums;
      let articles = this.data.articleList.concat(list);
      this.setData({articleList:articles,offset:this.data.offset+list.length,showBottom:show,isLoading:false})
      wx.hideNavigationBarLoading({
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
    this.getData()
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
    this.getData()

  },
})