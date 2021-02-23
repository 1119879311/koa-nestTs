"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//判断是否合法日期
function isDate(val) {
    return val instanceof Date && !isNaN(val.getTime());
}
exports.isDate = isDate;
//补0
function setFill(val) {
    return val > 9 ? val : '0' + val;
}
exports.setFill = setFill;
function dateFormat(option = { date: new Date(), patter: 'YYYY-MM-DD mm:ss' }) {
    let date = option.date || new Date();
    let patter = option.patter || 'YYYY-MM-DD mm:ss';
    let nowTime = date;
    if (!isDate(nowTime)) { // 有可能是日期格式的字符串，或者时间戳
        nowTime = /^\d+$/.test(nowTime + '') ? Number(nowTime) : nowTime;
        nowTime = new Date(nowTime); //尝试转为日期
        //转为之后再做一次判断
        if (!isDate(nowTime)) {
            return date; //如果还不是日期格式，直接返回原数据
        }
    }
    nowTime = nowTime;
    let data = {
        "Y+": nowTime.getFullYear(),
        "M+": setFill(nowTime.getMonth() + 1),
        "D+": setFill(nowTime.getDate()),
        "h+": setFill(nowTime.getHours()),
        "m+": setFill(nowTime.getMinutes()),
        "s+": setFill(nowTime.getSeconds()),
        "S": nowTime.getMilliseconds(),
        "J": Math.floor((nowTime.getMonth() + 3) / 3),
    };
    for (const key in data) {
        if (new RegExp("(" + key + ")").test(patter)) {
            patter = patter.replace(RegExp.$1, data[key]);
        }
    }
    return patter;
}
exports.dateFormat = dateFormat;
