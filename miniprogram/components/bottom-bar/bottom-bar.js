// components/bottom-bar/bottom-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:String,
      value:"详情"
    },
    url:{
      type:String,
      value:""
    },
    status:{
      type:Boolean,
      value:true
    },
    isLink:{
      type:Boolean,
      value:false
    },
    text:{
      type:Array,
      value:[
        "已处理","未处理"
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
