const db = wx.cloud.database({env:"safe-school-xlcld",});
const collegeCollection = db.collection("college");
const userCollection = db.collection("user");
const image_pre = "student-";
const dateFormat = require("../../utils/dateFormate.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId:undefined,
    show:false,
    columns:[],
    // 学院
    college:undefined,
    // 班级
    className:undefined,
    // 姓名
    name:undefined,
    // 学号
    stuNo:undefined,
    // 学生证(工作证)照片地址
    imageUrl:[],
    // 联系电话
    phone:"",
    isloading:false,
    // 是否可以注册
    flag:true,
    errMsg:undefined,
    buttonLoading:false
  },

  onSubmit(){
    let name = this.data.name;
    let stuNo = this.data.stuNo;
    let college = this.data.college;
    let className = this.data.className;
    let phone = this.data.phone;
    let imageUrl = this.data.imageUrl;
    if(name == ""){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }
    if(stuNo == ""){
      wx.showToast({
        title: '请输入学号',
        icon:"none"
      })
      return;
    }
    if(college == ""){
      wx.showToast({
        title: '请选择学院信息',
      })
      return;
    }
    if(className == ""){
      wx.showToast({
        title: '请选择班级',
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
      no:stuNo,
      college:college,
      class:className,
      phone:phone,
      imageUrl:imageUrl[0].url,
      tag:"student",
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
              complete:res=>{
                wx.navigateTo({
                  url: '../result-page/result-page?status=0&text=上传成功，请等待审核通过',
                })
              }
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
      stuNo:e.detail.replace(/\s+/g,"")
    })
  },

  checkExist(){
    userCollection.where({
      no:this.data.stuNo,
    }).get().then(res=>{
      console.log(res.data)
      if(res.data.length>0){
        wx.showToast({
          title: '学生信息已注册',
          icon:"none"
        })
        this.setData({
          flag:false,
          errMsg:"学生信息已注册"
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

   // 选择确认回调
   onConfirm(e){
    if(this.data.type == 0){
      this.setData({college:e.detail.value,show:false})
    }else{
      this.setData({
        className:e.detail.value,
        show:false
      })
    }
  },

    // 点击选择回调
    onSelect(e){
      let {type} = e.currentTarget.dataset;
      this.setData({type:type})
      // 选择班级
      if(type == 1){
        // 没选择学院，提示先选择学院
        if(this.data.college == undefined){
          wx.showToast({
            title: '请先选择学院',
            icon:"none"
          })
          return;
        }else{
          collegeCollection.field({
            classes:true
          }).where({
            name:this.data.college
          }).get().then(res=>{
            this.setData({columns:res.data[0].classes,show:true})
          }).catch(res=>{
            wx.showToast({
              title: '数据加载失败',
              icon:"none"
            })
          })
        }
      }else{
        // 选择学院
        var list = [];
        collegeCollection.field({name:true}).get().then(res=>{
          for(let i=0;i<res.data.length;i++){
            list.push(res.data[i].name)
          }
          this.setData({columns:list,show:true});
        }).catch(res=>{
          wx.showToast({
            title: '数据加载失败',
            icon:"none"
          })
        })
      }
    },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openId:options.openId
    })
    wx.setNavigationBarTitle({
      title: '学生身份认证',
    })
  },
})