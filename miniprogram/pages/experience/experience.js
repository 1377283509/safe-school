const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("user");

Page({

  data: {
    openId:undefined,
  },

  onTapButton(e){
    let {tag} = e.currentTarget.dataset;
    var name;
    switch(Number.parseInt(tag)){
      case -1:
        name = "普通用户";
        break;
      case 0:
        name = "普通管理员"
        break;
      case 1:
        name = "专项管理员";
        break;
      case 2:
        name = "高级管理员";
        break;
      default:
        name = ""
    }
    // 判断是否存在体验身份
    collection.where({
      _openid:this.data.openId
    }).get().then(res_1=>{
      // 存在询问是否覆盖
      if(res_1.data.length>0){
        wx.showModal({
          cancelColor: 'lightgray',
          content:"已存在一个体验身份，确定要覆盖吗？",
          success:res_2=>{
            if(res_2.confirm){
              // 删除员=原身份
              collection.doc(res_1.data[0]._id).remove({
                success:res_3=>{
                   // 创建新体验用户
                  this.createUser(name,tag)
                  },
                  fail:res_3=>{
                    wx.showToast({
                      title: '注销失败',
                      icon:"none"
                    }) 
                  }
                })
            }
          }
        })
      }else{
        this.createUser(name,tag)
      }
    })
  },

  createUser(name, tag){
    collection.add({
      data:{
        name:name,
        no:Date.now(),
        phone:123456,
        canUse:true,
        authStatus:0,
        admin:Number.parseInt(tag)
      },
      success:res=>{
        wx.showToast({
          title: '体验账号创建成功',
        })
      },fail:res=>{
        wx.showToast({
          title: '体验账号创建失败',
          icon:"none"
        })
      }
    })
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '体验入口',
    })
    let openId = options.openId;
    console.log(openId)
    this.setData({
      openId:openId
    })
  },
})