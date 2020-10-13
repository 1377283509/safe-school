const app = getApp()
const db = wx.cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("seek-help")
const dateFormat = require("../../utils/dateFormate.js")
const Distance = require("../../utils/calculateDistance.js")
const maxSpeed = 3;
const iconPath = "../../images/icon/yuandian.png"
Page({
  data: {
    // 求救数据id
    id:undefined,
    // 上传位置的定时器id
    timerId:undefined,
    // 地图信息
    longitude:"",
    latitude:"",
    markers:[],
    polyline:{
      points:[],
      color:"red",
      width:2,
      arrowLine:true
    },
    // 页面相关信息
    showPhones:false,
    showTools:false,
    alarmNumbers:"",
    phones:[
      {
        "name":"报警",
        "phone":"110"
      },
    ]
  },

  // 显示marker的信息
  showMarkerDetail(e){
    console.log(e)
    let {markerId} = e;
    let marker = this.data.markers[markerId];
  },

  // 上传位置信息
  uploadPosition(res){
    var that = this;
    // 获取位置
    var _ = db.command;
    var markers = that.data.markers;
    var marker = "markers[" + markers.length + "]";
    var date = dateFormat.toDate(Date.now(),"yyyy-MM-dd hh:mm")
    var points = that.data.polyline.points;
    var point = "points[" + points.length + "]";
    var {latitude, longitude, speed, accuracy, altitude} = res;
    var data = {
      longitude:longitude,
      latitude:latitude,
      info:{
        date:date,
        speed:speed,
        accuracy:accuracy,
        altitude:altitude
      },
      id:markers.length,
      iconPath:iconPath
    }
    that.setData({
        [marker]:data,
        [point]:{latitude:latitude,longitude:longitude}
    })
    collection.doc(that.data.id).update({
      data:{
          markers:_.push([data])
        },
      success:res=>{
        wx.showToast({
          title: '上传成功',
        })
      },
      fail:res=>{
          wx.showToast({
            title: '上传失败',
          })
      }
    })
  },

  // 取消求救回调
  onCancelHelp(){
    wx.stopLocationUpdate({
      complete: (res) => {
        wx.showToast({
          title: '已关闭位置监听',
        })
      },
    })
    this.setData({
      showTools:false,
    })
  },

  // 点击求救回调
  onSeekHelp(){
    var that = this;
    wx.showModal({
      cancelColor: 'gray',
      title:"确定开启吗？",
      content:"开启后位置信息将实时上传至管理端，切勿拿人身安全开玩笑！",
      success:res=>{
        if(res.confirm){
          // 在集合中创建数据
          collection.add({
            data:{
              "openId":app.globalData.userInfo._openid,
              "date":dateFormat.toDate(Date.now(),"yyyy-MM-dd hh:mm"),
              "markers":that.data.markers,
              "name":app.globalData.userInfo.name,
              "phone":app.globalData.userInfo.phone
            },
            success:res=>{
              that.setData({
                id:res._id,
                showTools:true
              })
              wx.startLocationUpdateBackground({
                complete: (res) => {
                  wx.showToast({
                    title: '已开启位置监听',
                  })
                   if(!that.data.showTools){
                     // 当取消求救时，关闭位置监听
                     wx.offLocationChange()
                   }
                   wx.onLocationChange((result) => {
                     // 最后一个速度大于6m/s的位置信息
                    var last;
                    // count表示速度大于6m/s的点的个数
                    var count = 0;
                    // 速度超过6m/s
                    if(result.speed > maxSpeed){
                        // 判断是否是第一个,是：上传这个点，count++,不是不上传，将最后一个速度大于6的点设置为当前点
                        if(count == 0){
                          this.uploadPosition(result)
                          count += 1;
                        }else{
                          last = result;
                        }
                    }else{
                      // 速度不超过6m/s
                      // 判断是否是连续速度大于6m/s的最后一个点
                      if(count == 1){
                        // count为1说明是最后一个点，上传，然后count置0
                        this.uploadPosition(last)
                        count = 0;
                      }else{
                        // 否则，判断当前移动距离是否大于指定距离，大于上传，小于跳过
                        var last = that.data.markers[that.data.markers.length-1];
                        var distance = Distance.getDistance({
                            lat:result.latitude,
                            lng:result.longitude
                          },{
                            lat:last.latitude,
                            lng:last.longitude
                        })
                        wx.showToast({
                          title: '移动：'+ distance + "米",
                          icon:"none"
                        })
                        if(distance > 10){
                          this.uploadPosition(result)
                        }
                      }
                    }
                   })
                },
              })
            }
          })
        }
      }
    })
  },

  // 加载电话信息
  getPhonesData(){
     // 加载电话信息
     var alarmNumbers = app.globalData.alarmNumbers;
     var phones = this.data.phones;
     var concat = app.globalData.userInfo.concat;
     phones.push({
       "name":"保卫处",
       "phone":alarmNumbers,
     })
     if(concat){
      phones.push(({
        "name":"紧急联系人: "+concat.name,
        "phone":concat.phone
      }))
     }
     this.setData({
       phones:phones
     })
  },

  // 关闭弹出层回调
  onClose(e){
    let {tag} = e.target.dataset;
    if(tag == "phone"){
      this.setData({
        showPhones:false
      })
    }
  },

  // 拨号
  callToPhone(e){
    let {phone} = e.target.dataset;
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

  // 获取定位
  getLocation(){
    wx.getLocation({
      altitude: 'false',
      isHighAccuracy:true,
      type:"gcj02",
      highAccuracyExpireTime:15000,
      success:res=>{
        var markers = this.data.markers;
        var points = this.data.polyline.points;
        var point = "points[" + points.length + "]"; 
        markers.push({
          id:0,
          latitude:res.latitude,
          longitude:res.longitude,
          info:{
            date:dateFormat.toDate(Date.now(),"yyyy-MM-dd hh:mm"),
            speed:res.speed,
            accuracy:res.accuracy,
          },
          iconPath:"cloud://safe-school-xlcld.7361-safe-school-xlcld-1301783820/iconicon/qidian.png"
        })
        this.setData({
          longitude:res.longitude,
          latitude:res.latitude,
          markers:markers,
          [point]:{
            altitude:res.altitude,
            longitude:res.longitude
          }
        })
        console.log(this.data.polyline)
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
  },

  onReady: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
  },

  onShow: function () {
    this.getLocation();
  },
})