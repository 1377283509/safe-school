function checkPhoneNumber(phone){
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  return myreg.test(phone)
}

module.exports = {
  checkPhoneNumber: checkPhoneNumber,
}