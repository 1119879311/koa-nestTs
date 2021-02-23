//判断是否合法日期
export function isDate(val: any) {
    return val instanceof Date && !isNaN(val.getTime())
}
//补0
export function setFill(val: number) {
    return val > 9 ? val : '0' + val
}

type IdateFormat = {
    date?: Date | string | number | undefined;
    patter?: string | undefined;
}
export function dateFormat(option: IdateFormat = { date: new Date(), patter: 'YYYY-MM-DD mm:ss' }) {
    let date = option.date || new Date()
    let patter = option.patter || 'YYYY-MM-DD mm:ss'
    let nowTime = date;
    if (!isDate(nowTime)) {// 有可能是日期格式的字符串，或者时间戳
        nowTime = /^\d+$/.test(nowTime + '') ? Number(nowTime) : nowTime;
        nowTime = new Date(nowTime);//尝试转为日期
        //转为之后再做一次判断
        if (!isDate(nowTime)) {
            return date;//如果还不是日期格式，直接返回原数据
        }
    }
    nowTime = nowTime as Date;
    let data: Record<string, any> = {
        "Y+": nowTime.getFullYear(), //年
        "M+": setFill(nowTime.getMonth() + 1),//月
        "D+": setFill(nowTime.getDate()),//日
        "h+": setFill(nowTime.getHours()),//时
        "m+": setFill(nowTime.getMinutes()),//分
        "s+": setFill(nowTime.getSeconds()),//秒
        "S": nowTime.getMilliseconds(),  //毫秒  
        "J": Math.floor((nowTime.getMonth() + 3) / 3), //季度 
    }
    for (const key in data) {
        if (new RegExp("(" + key + ")").test(patter)) {
            patter = patter.replace(RegExp.$1, data[key])
        }
    }

    return patter
}