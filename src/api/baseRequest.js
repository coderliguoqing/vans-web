/**
 * Created by Guoqing on 2017/6/13.
 * 封装jQuery ajax 请求简单化
 * error 发生时，异常处理
 */

import AppInstance from '@/main'

/**
 * ajax 封装
 * 正常情况下传  url, data, success
 * @param url
 * @param dataType
 * @param type
 * @param contentType
 * @param async
 * @param cache
 * @param data
 * @param success
 * @param error
 */
export const baseAjax = ({
  url = '',
  dataType = 'json',
  type = 'POST',
  contentType = "application/json",
  async = true,
  cache = true,
  data = '',
  processData = true,
  success,
  error
} = {}) => {
  $.ajax({
    type,
    url: url.indexOf("/task") > -1 ? (AppConfig.TIMER_PATH + url) : (AppConfig.BASE_PATH + url),
    dataType,
    contentType,
    async,
    cache,
    processData,
    data: data,
    success: function (data) {
      if (success) {
        success(data)
      }
    },
    error: function(XmlHttpRequest,options,exc){
      switch ( XmlHttpRequest.status ){
        case 500:
          AppInstance.$message({
            message: '500 ' + "服务器内部错误",
            type: 'error'
          });
          break;
        case 404:
          AppInstance.$message({
            message: '404 ' + "访问的资源不存在",
            type: 'error'
          });
          break;
        case 403:
          AppInstance.$message({
            message: '403 ' + "服务器拒绝了您的请求",
            type: 'error'
          });
          break;
        case 401:
          AppInstance.$message({
            message: '401 ' + "访问资源未授权",
            type: 'error'
          });
        default:
          AppInstance.$message({
            message: "您的登录已失效，请重新登录",
            type: 'error'
          });
          window.parent.location.href = AppConfig.LOGIN_PATH;
          break;
      }
      if (error) {
        error()
      }
    },
    beforeSend: function(xhr){
      xhr.setRequestHeader('Authorization', sessionStorage.getItem("token") );
    }
  })
}


