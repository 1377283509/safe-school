const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("seek-help")
const users = db.collection("user")
const QQmapWX = require("../../utils/qqmap-wx-jssdk.js")
Page({
  data: {
    openId:undefined,
    phone:undefined,
    showUserInfo:false,
    userInfo:undefined,
    marker:undefined,
    showMarkerInfo:false,
    // 地图信息
    longitude:"",
    latitude:"",
    markers:[],
    menus:[
      {
        name:"身份信息",
        icon:"cloud://safe-school-xlcld.7361-safe-school-xlcld-1301783820/iconicon/xuesheng.png",
        onTap:"showUserInfo"
      },
      {
        name:"联系人",
        icon:"cloud://safe-school-xlcld.7361-safe-school-xlcld-1301783820/iconicon/phone-3.png",
        onTap:"callToPhone"
      },
      {
        name:"我的位置",
        icon:"cloud://safe-school-xlcld.7361-safe-school-xlcld-1301783820/iconicon/wodeweizhi.png",
        onTap:"backToMyPosition"
      }
    ],
  },

  onClose(){
    this.setData({
      showUserInfo:false,
      showMarkerInfo:false
    })
  },

  pathPlane(){
    let plugin = requirePlugin('routePlan');
    var key = '644BZ-3VO3G-YEAQN-IZXQG-ZUO35-O5BTU';  //使用在腾讯位置服务申请的key
    var referer = 'wx6dd7d07961ea5906';   //调用插件的app的名称
    var {latitude,longitude} = this.data.marker;
    var qqMapSdk = new QQmapWX({
      key:key
    })
    qqMapSdk.reverseGeocoder({
      location:{
        longitude:longitude,
        latitude:latitude
      },
      success:res=>{
        let endPoint = JSON.stringify({  //终点
          'name':res.result.address,
          'latitude': latitude,
          'longitude': longitude
      });
        wx.navigateTo({
          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
      });
      },
      fail:res=>{
        wx.showToast({
          title: '地址解析失败',
          icon:"none"
        })
      }
    })
   
  },
  // 导航到用户信息页
  showUserInfo(){
    // 获取用户信息
    var user = this.data.userInfo;
    if(!user){
      users.where({
        _openid:this.data.openId,
      }).get().then(res=>{
        var user = res.data[0]
        this.setData({
          userInfo:user,
          showUserInfo:true
        })
      }).catch(res=>{
        wx.showToast({
          title: '数据加载失败',
          icon:'none'
        })
      })
    }else{
      this.setData({
        showUserInfo:true
      })
    }
  },

  // 显示marker的信息
  showMarkerInfo(e){
    let {markerId} = e;
    let marker = this.data.markers[markerId];
    this.setData({
      marker:marker,
      showMarkerInfo:true
    })

  },

  // 拨号
  callToPhone(){
    let phone = this.data.phone;
    wx.makePhoneCall({
      phoneNumber:phone
    })
  },

  // 点击电话回调
  onTapPhone(e){
    if(this.data.phones.length == 1){
      this.getPhonesData()
    }
    this.setData({
      showPhones:true,
    })
  },
  
  // 回到当前位置
  backToMyPosition(){
    let mapContext = wx.createMapContext('map')
    mapContext.moveToLocation()
  },

  getData(id){
    var that = this;
    collection.doc(id).watch({
      onChange: function(snapshot) {
        let list = snapshot.docChanges;
        that.setData({
          markers:list[list.length-1].doc.markers
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
    },

    // 获取定位
    getLocation(){
      wx.getLocation({
        altitude: 'false',
        isHighAccuracy:true,
        type:"gcj02",
        highAccuracyExpireTime:15000,
        success:res=>{
          this.setData({
            longitude:res.longitude,
            latitude:res.latitude,
          })
        },
        // 失败打开设置界面设置权限
        fail:res=>{
          wx.showModal({
            cancelColor: 'gray',
            title:"未开启位置服务，将无法正常使用此功能",
            confirmText:"去开启",
            success:res=>{
              if(res.confirm){
                wx.openSetting({
                  complete: (res) => {
                  },
                })
              }
            }
          })
        }
      })
    },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '紧急求救',
    })
    wx.getSystemInfo({
      success:res=>{
        if(!res.locationEnabled){
          wx.showModal({
            cancelColor: 'gray',
            title:"检测到未打开系统位置服务，请手动打开！"
          })
        }
      },
      fail:res=>{
        wx.showToast({
          title: '系统信息获取失败',
          icon:'none'
        })
      }
    })
    this.setData({
      phone:options.phone,
      openId:options.openId
    })
    this.getData(options.id);
    this.getLocation()
  },

  onReady: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
  },
})