var formatNumber = function (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var regYear = RegExp("(y+)", "i");

function dateFormat(timestamp, format) {
  if (!format) {
    format = "yyyy-MM-dd hh:mm:ss";
  }
  timestamp = parseInt(timestamp);
  // 通过getDate()方法获取date类型的时间
  var realDate = new Date(timestamp);
  function timeFormat(num) {
    return num < 10 ? '0' + num : num;
  }
  var date = [
    ["M+", timeFormat(realDate.getMonth() + 1)],
    ["d+", timeFormat(realDate.getDate())],
    ["h+", timeFormat(realDate.getHours())],
    ["m+", timeFormat(realDate.getMinutes())],
    ["s+", timeFormat(realDate.getSeconds())],
    ["q+", Math.floor((realDate.getMonth() + 3) / 3)],
    ["S+", realDate.getMilliseconds()],
  ];
  var reg1 = regYear.exec(format);
  // console.log(reg1[0]);
  if (reg1) {

    format = format.replace(reg1[1], (realDate.getFullYear() + '').substring(4 - reg1[1].length));
  }
  for (var i = 0; i < date.length; i++) {
    var k = date[i][0];
    var v = date[i][1];
    // getRegExp初始化一个正则表达式对象
    var reg2 = RegExp("(" + k + ")").exec(format);
    if (reg2) {
      format = format.replace(reg2[1], reg2[1].length == 1
        ? v : ("00" + v).substring(("" + v).length));
    }
  }
  return format;
}

function parse(fmt) {
  var fmt1 = fmt.substring(0, 19);
  var reg = getRegExp("-", "g");
  var fmt2 = fmt1.replace(reg, '/');
  var timestamp = getDate(fmt2).getTime();
  return timestamp;
}


module.exports = {
  toTimestamp: parse,
  toDate:dateFormat
}