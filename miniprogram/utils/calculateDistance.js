function getRad(d) {
  return d * Math.PI / 180.0;
}

/**
* 计算两个经纬度坐标点之间的距离
* @param  {object} lnglatA 起点坐标点
* @param  {object} lnglatB 终点坐标点
* @return {number} 计算后得出两点之间的距离
*/
function getDistance(lnglatA, lnglatB) {
  var radLat1 = getRad(lnglatA.lat);
  var radLat2 = getRad(lnglatB.lat);
  var a = radLat1 - radLat2;
  var b = getRad(lnglatA.lng) - getRad(lnglatB.lng);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378137; // 地球半径(米);
  return s;
}

/**
* 计算多个经纬度坐标点之间的距离
* @param  {array} 经纬度数组
* @return {number} 计算后得出多个点之间的总距离
*/
function totalDistance(arr) {
  var len = arr.length;
  var distance = 0;
  for (var i = 0; i < len - 1; i++) {
      distance += getDistance(arr[i], arr[i+1]);
  }
  return distance;
}

module.exports = {
  getDistance: getDistance,
  totalDistance:totalDistance
}