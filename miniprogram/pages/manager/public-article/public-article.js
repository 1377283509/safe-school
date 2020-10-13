const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const articleCollection = db.collection("article")
const nums = app.globalData.amountOfDataPerPage;
const image_pre = "article-";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:undefined,
    isUpdate:false,
    // 标题
    title:undefined,
    // 标签
    tag:undefined,
    // 文章地址
    url:undefined,
    // 发布组织
    organization:undefined,
    // 配图链接
    imageList:[],
    isLoading:false,
    buttonLoading:false,
  },

  onPublic(){
    let {title,tag,url,imageList,organization} = this.data;
    if(title == undefined || title == ""){
      wx.showToast({
        title: '请输入标题',
        icon:"none"
      })
      return;
    }
    if(organization == undefined || organization == ""){
      wx.showToast({
        title: '请输入组织名',
        icon:"none"
      })
    }
    if(url == undefined || url == ""){
      wx.showToast({
        title: '请输入文章地址',
        icon:"none"
      })
    }
    this.setData({buttonLoading:true})
    if(this.data.isUpdate){
      articleCollection.doc(this.data.id).update({
        data:{
          title:title,
          tag:tag,
          url:url,
          imageUrl:imageList.length==0?"":imageList[0].url,
          organization:organization,
          pubDate:Date.now()
        },
        success:res=>{
          wx.redirectTo({
            url: '../../result-page/result-page?status=0&text=发布成功',
          })
        },
        fail:res=>{
          wx.showToast({
            title: '发布失败',
            icon:"none"
          })
        }
      })
    }else{
      articleCollection.add({
        data:{
          title:title,
          tag:tag,
          url:url,
          imageUrl:imageList.length==0?"":imageList[0].url,
          organization:organization,
          pubDate:Date.now()
        },
        success:res=>{
          wx.redirectTo({
            url: '../../result-page/result-page?status=0&text=发布成功',
          })
        },
        fail:res=>{
          wx.showToast({
            title: '发布失败',
            icon:"none"
          })
        }
      })
    }


  },
  onInputTitle(event){
    this.setData({
      title:event.detail
    })
  },
  onInputOrg(event){
    this.setData({
      organization:event.detail
    })
  },

  onInputTag(event){
    this.setData({
      tag:event.detail
    })
  },

  onInputUrl(event){
    this.setData({
      url:event.detail
    })
  },

  // 删除图片
 deleteImage(event){
  var list = this.data.imageList;
  list.splice(event.detail.id,1);
  var temp = [];
  temp.push(event.detail.file.url)
  wx.cloud.deleteFile({
    fileList:temp,
  })
  this.setData({imageList:list});
},

  // 上传图片
  afterRead(event){
  var path = event.detail.file.path;
  var date = Date.parse(new Date());
  this.setData({isloading:true});
  wx.cloud.uploadFile({
  cloudPath:image_pre + date + ".png",
  filePath:path,
  success:res=>{
    var list = this.data.imageList;
    list.push({"url":res.fileID,"isImage":true});
    this.setData({imageList:list,isloading:false});
  },
  fail:res=>{
    wx.showToast({
      title: '上传失败',
      icon:"none"
    })  
  }
})
},

  // 加载数据
  getData(id){
    wx.showLoading({
      title: '努力加载中',
    })
    articleCollection.where({
      _id:id
    }).get().then(res=>{
      var article = res.data[0]
      var temp = []
      if(article.imageUrl != undefined){
        temp.push({
          url:article.imageUrl,
          isImage:true
        })
      }
      this.setData({
        id:article._id,
        isUpdate:true,
        title:article.title,
        tag:article.tag,
        organization:article.organization,
        url:article.url,
        imageList:temp
      })
      wx.hideLoading({
        complete: (res) => {},
      })
    }).catch(res=>{
      wx.showToast({
        title: '数据加载失败',
        icon:"none"
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发布文章',
    })
    if(options.id!=undefined){
      this.getData(options.id)
    }
  }
})