// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({env:"safe-school-xlcld"});
const collection = db.collection("user-activity");

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await collection.add({
      data:{
        user:event.openId,
        activity:event.id
      }
    })
  }catch(e){
    return e;
  }
}