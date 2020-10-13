// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({env:"safe-school-xlcld",});
const userCollection = db.collection("user");

// 云函数入口函数
exports.main = async (event, context) => {
 try{
    return await userCollection.doc(event.id).update({
      data:{
        authDesc:event.authDesc,
        authStatus:event.authStatus
      }
    })
 }catch(e){
   return e;
 }
}