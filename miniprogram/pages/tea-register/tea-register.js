const db = wx.cloud.database({env:"safe-school-xlcld",});
const collegeCollection = db.collection("college");
const userCollection = db.collection("user");
const image_pre = "teacher-";
const dateFormat = require("../../utils/dateFormate.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId:undefined,
    show:false,
    // 姓名
    name:undefined,
    // 工号
    no:undefined,
    // 学生证(工作证)照片地址
    imageUrl:[],
    // 联系电话
    phone:undefined,
    isloading:false,
    // 是否可以注册
    flag:true,
    errMsg:undefined,
    buttonLoading:false
  },

  onSubmit(){
    let {name,no,imageUrl,phone} = this.data;
    if(name == ""){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }
    if(no == ""){
      wx.showToast({
        title: '请输入工号',
        icon:"none"
      })
      return;
    }
    if(phone == ""){
      wx.showToast({
        title: '请输入手机号',
        icon:"none"
      })
      return;
    }
    if(imageUrl.length < 1){
      wx.showToast({
        title: '请上传学生证图片',
        icon:"icon"
      })
      return;
    }
    this.setData({
      buttonLoading:true
    })

    let data = {
      name:name,
      no:no,
      phone:phone,
      imageUrl:imageUrl[0].url,
      tag:"teacher",
      // 状态未0表示审核通过可以正常使用，为1表示审核中，2表示未通过审核
      authStatus:1,
      canUse:true,
      // -1表示非管理用户,0核心管理用户,1基础管理用户,2心理咨询管理用户
      admin:-1,
      authDesc:""
    }
    wx.requestSubscribeMessage({
      tmplIds: ["I-rpSxq6_xgQuqAezafTkbiPO7A7fXtqnrDL33on-Hs"],
      complete:res=>{
        if(this.data.flag){
          userCollection.add({
            data:data,
            success:res=>{
              wx.navigateTo({
                url: '../result-page/result-page?status=0&text=上传成功，请等待审核通过',
              })
            },
            fail:res=>{
              console.log(res)
              wx.showToast({
                title: '上传失败',
                icon:"none"
              })
            }
          })
        }else{
          wx.showToast({
            title: this.data.errMsg,
            icon:"none"
          })
        }
      }
    })
  },

  // 删除图片
  deleteImage(event){
    var list = this.data.imageUrl;
    list.splice(event.detail.id,1);
    var temp = [];
    temp.push(event.detail.file.url)
    wx.cloud.deleteFile({
      fileList:temp,
    })
    this.setData({imageUrl:list});
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
        var list = this.data.imageUrl;
        list.push({"url":res.fileID,"isImage":true});
        this.setData({imageUrl:list,isloading:false});
      },
      fail:res=>{
        wx.showToast({
          title: '上传失败',
          icon:"none"
        })
        this.setData({isloading:false})
      }
    })
  },

  onInputName(e){
    this.setData({
      name:e.detail.replace(/\s+/g,"")
    })
  },

  onInputNumber(e){
    this.setData({
      no:e.detail.replace(/\s+/g,"")
    })
  },

  checkExist(){
    userCollection.where({
      no:this.data.stuNo,
    }).get().then(res=>{
      console.log(res.data)
      if(res.data.length>0){
        wx.showToast({
          title: '教师信息已注册',
          icon:"none"
        })
        this.setData({
          flag:false,
          errMsg:"教师信息已注册"
        })
      }else{
        this.setData({
          flag:true,
          errMsg:""
        })
      }
    })
  },

  onInputPhone(e){
    this.setData({
      phone:e.detail.replace(/\s+/g,"")
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openId:options.openId
    })
    wx.setNavigationBarTitle({
      title: '教师身份认证',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})