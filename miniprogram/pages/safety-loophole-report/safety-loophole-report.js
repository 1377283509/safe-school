// 文件前缀
const image_pre = "safety_loophole-";
const db = wx.cloud.database({env:"safe-school-xlcld",});
const collections = db.collection("safety-loophole");

Page({
  data: {
      type: undefined,
      address: undefined,
      description: undefined,
      imageList: [],
      isloading: false,
      actions: [
        { name: '交通类'},
        { name: '建筑类'},
        { name: '公寓类'},
        { name: '食品类'},
        { name: '消防类'},
        { name: '其它'},
      ],
      show:false
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


  // 上报
  onSubmit(event){
    var address = this.data.address;
    var description = this.data.description;
    var type = this.data.type;
    var imgList = this.data.imageList;
    if(type == undefined){
      wx.showToast({
        title: '请选择类型',
        icon:"none"
      });
      this.setData({show:true});
      return;
    }
    if(address == undefined || address == ""){
      wx.showToast({
        title: '请填写地点信息',
        icon:"none"
      })
      return;
    }
    if(description == undefined || description == ""){
      wx.showToast({
        title: '请填写描述',
        icon:"none"
      })
      return;
    }
    if(imgList.length < 1){
      wx.showToast({
        title: '请至少上传一张图片',
        icon:"none"
      })
      return;
    }

    collections.add({
      data:{
      type:type,
      address:address,
      description:description,
      imageList:imgList,
      status:false
      }
    }).then(res=>{
      wx.redirectTo({
        url: '../result-page/result-page?text=上报成功&status=0',
      })
    }
    ).catch(res=>{
      wx.navigateTo({
        url: '../result-page/result-page?text=上报失败&status=1',
      })}
    );
  },

  clearAddress(){
      this.setData({address:undefined});
  },
  clearDescription(){
    this.setData({description:undefined});
  },

  setAddress(event){
    var address = event.detail.replace(/\s+/g,"");
    this.setData({address:address});
  },

  setDescription(event){
    var description = event.detail.replace(/\s+/g,"");
    this.setData({description:description});
  },

  // action_sheet
  onSelect(event){
    this.setData({type:event.detail.name,show:false});
  },

  // onChoose
  onChoose(){
    this.setData({show:true});
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '隐患上报',
    });
  },

})