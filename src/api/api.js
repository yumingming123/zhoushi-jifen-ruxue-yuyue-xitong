import request from '@/api/quantui.js'

function getCode(data) {
  return request({
    url: 'http://47.114.102.94:8081/kpi/kpi/yyPeople/sendMsgCode.do',
    method: 'get',
    data
  })
}

function checkCode(data) {
  return request({
    url: 'http://47.114.102.94:8081/kpi/kpi/yyPeople/getByPhone.do',
    method: 'get',
    data
  })
}

// 获取  预约时间表
function getYuYueList(data) {
  return request({
    url: 'http://47.114.102.94:8081/kpi/kpi/yyResource/listNg.do',
    method: 'get',
    data
  })
}

// 修改  保存 个人信息
function saveInfo(data) {
  return request({
    url: 'http://47.114.102.94:8081/kpi/kpi/yyPeople/saveNg.do',
    method: 'post',
    data
  })
}

// 发送预约请求
function getYuYue(data) {
  return request({
    url: 'http://47.114.102.94:8081/kpi/kpi/yyLog/saveNg.do',
    method: 'post',
    data
  })
}

// 获取网络时间
function getNetTime(data) {
  return request({
    url: 'http://47.114.102.94:8081/kpi/kpi/yyResource/getCurtime.do',
    method: 'get',
    data
  })
}

export default {
  getCode,
  checkCode,
  getYuYueList,
  saveInfo,
  getYuYue,
  getNetTime
}