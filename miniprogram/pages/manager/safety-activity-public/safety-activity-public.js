const dateFormat = require("../../../utils/dateFormate.js")
const image_pre = "activity-";
const db = wx.cloud.database({env:"safe-school-xlcld"});
const collection = db.collection("activity");
Page({
  data: {
    // 底部时间选择器
    show:false,
    minHour: 0,
    maxHour: 24,
    minDate: new Date().getTime(),
    maxDate: new Date(2021, 1, 1).getTime(),
    currentDate: new Date().getTime(),
    buttonLoading:false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }else if(type == 'day'){
        return `${value}日`;
      }else if(type == 'hour'){
        return `${value}时`;
      }
      return value;
    },
    isloading:false,
    // 活动主题
    title:undefined,
    // 活动开始时间
    startTime:undefined,
    // 活动地点
    address:undefined,
    // 组织者
    publisher:undefined,
    // 活动内容
    content:undefined,
    // 参与人数
    totalNums:undefined,
    // 活动奖励
    reward:undefined,
    // 状态：报名中，未开始，进行中，已结束
    status:undefined,
    // 已报名人数
    applicationNums:undefined,
    // 图片
    imageList:[]
  },

  showToast(text){
    wx.showToast({
      title: text,
      icon:"none"
    })
  },

  onSubmit(e){
    let {address,publisher,totalNums,content,reward,title,startTime,imageList} = this.data;
    if(!address){
      this.showToast("请输入地址");
      return;
    }
    if(!publisher){
      this.showToast("请输入组织者");
      return;
    }
    if(!totalNums){
      this.showToast("请输入活动总人数");
      return;
    }
    if(!content){
      this.showToast("请输入活动内容");
      return;
    }
    if(!reward){
      this.showToast("请输入活动收获");
      return;
    }
    if(!title){
      this.showToast("请输入活动主题");
      return;
    }
    if(!startTime){
      this.showToast("请选择开始时间")
      return;
    }
    this.setData({
      buttonLoading:true
    })
    var imgList =[];
    for(var i=0;i<imageList.length;i++){
      imgList.push(imageList[i].url)
    }
    collection.add({
      data:{
        title:title,
        publisher:publisher,
        address:address,
        totalNums:totalNums,
        startTime:startTime,
        content:content,
        reward:reward,
        imageList:imgList,
        status:true,
        users:[]
      }
    }).then(res=>{
      this.setData({
        buttonLoading:false
      })
      wx.redirectTo({
        url: '../../result-page/result-page?text=发布成功&status=0',
      })
    }).catch(res=>{
      this.showToast("数据上传失败")
    })
  },

  onInputPublisher(event){
   this.setData({publisher:event.detail.replace(/\s+/g,"")});
  },
  onInputTitle(event){
    this.setData({title:event.detail.replace(/\s+/g,"")});
  },

   onInputAddress(event){
    this.setData({address:event.detail.replace(/\s+/g,"")});
   },

   onInputTotalNums(event){
    this.setData({totalNums:event.detail.replace(/\s+/g,"")});
   },

   onInputContent(event){
    this.setData({content:event.detail.replace(/\s+/g,"")});
   },

   onInputReward(event){
    this.setData({reward:event.detail.replace(/\s+/g,"")});
   },
 

  // 打开时间选择器
  onSelectDate(e){
    this.setData({
      show:true,
    });
  },

  onInput(e){
    this.setData({
      currentDate:e.detail
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

  onConfirm(value){
    let date = dateFormat.toDate(this.data.currentDate,"yyyy-MM-dd hh:mm");
    this.setData({startTime:date,show:false});
  },

  onCancel(){
    this.setData({show:false});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.setNavigationBarTitle({
        title: '发布活动',
      })
  },
})