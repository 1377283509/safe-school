// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  //openid、result、认证状态、时间
  var msg;
  switch(event.status){
    case 0:
      msg = "认证审核通过"
      break;
    case 1:
      msg = "认证审核中"
      break;
    case 2:
      msg = "认证审核未通过"
      break;
    default:
      msg = ""
  }
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openId,
        lang: 'zh_CN',
        data: {
          thing1: {
            value: msg
          },
          date2: {
            value:event.date
          },
        },
        templateId: 'I-rpSxq6_xgQuqAezafTkbiPO7A7fXtqnrDL33on-Hs',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}