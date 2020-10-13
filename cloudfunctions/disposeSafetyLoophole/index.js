// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({env:"safe-school-xlcld",});
const collection = db.collection("safety-loophole")
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await collection.doc(event.id).update({
      data:{
        status:true,
      }
    })
  }catch(e){
    return e;
  }
}