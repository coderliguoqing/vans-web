var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
  var len = len - (s + '').length;
  for (var i = 0; i < len; i++) { s = '0' + s; }
  return s;
};
/**
 * access_token 存入本地缓存
 */
export default{
  setHeader: function (xhr) {
    xhr.setRequestHeader('Authorization', sessionStorage.getItem("token"));
  },
  formatDate: {
    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length);
          case 'M':
            return padding(date.getMonth() + 1, $0.length);
          case 'd':
            return padding(date.getDate(), $0.length);
          case 'w':
            return date.getDay() + 1;
          case 'h':
            return padding(date.getHours(), $0.length);
          case 'm':
            return padding(date.getMinutes(), $0.length);
          case 's':
            return padding(date.getSeconds(), $0.length);
        }
      });
    },
    parse: function (dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP);
      var matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length == matchs2.length) {
        var _date = new Date(1970, 0, 1);
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i]);
          var sign = matchs1[i];
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int);
              break;
            case 'M':
              _date.setMonth(_int - 1);
              break;
            case 'd':
              _date.setDate(_int);
              break;
            case 'h':
              _date.setHours(_int);
              break;
            case 'm':
              _date.setMinutes(_int);
              break;
            case 's':
              _date.setSeconds(_int);
              break;
          }
        }
        return _date;
      }
      return null;
    },
    //转化为东八时区时间
    getLocalTime: function (time, i) {
      //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
      if (typeof i !== 'number') return;
      var str = time.toString();
      str = str.replace("/-/g", "/");
      var oDate1 = new Date(str);
      var len = oDate1.getTime();
      return new Date(len + 3600000 * i);
    },
  },
  formatValid: {
    /**
     * 电话号码验证，包括（包括手机，固定电话，带区号，不带区号）
     * @param obj
     * @returns {boolean}
     */
    isTelephone: function (obj) {
      var pattern = /(^[0-9]{3,4}-[0-9]{3,8}$)|(^[0-9]{3,4}-[0-9]{3,4}-[0-9]{3,4}$)|(^[0-9]{3,8}$)|(^[0−9]3,4[0-9]{3,8}$)|(^0{0,1}1[0-9]{10}$)/;
      if (!pattern.test(obj)) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 邮箱格式校验
     * @param obj
     * @returns {boolean}
     */
    isEmail: function (obj) {
      var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!pattern.test(obj)) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 身份证格式校验
     * @param obj
     * @returns {boolean}
     */
    isIdentityCard: function (idNumber) {
      var vcity = {
        11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古',
        21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏',
        33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南',
        42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆',
        51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃',
        63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'
      }

      // 检查号码是否符合规范，包括长度，类型
      var isCardNo = function (obj) {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
        if (reg.test(obj) === false) {
          return false;
        }
        return true;
      }

      // 取身份证前两位,校验省份
      var checkProvince = function (obj) {
        var province = obj.substr(0, 2);
        if (vcity[province] == undefined) {
          return false;
        }
        return true;
      }

      // 检查生日是否正确
      var checkBirthday = function (obj) {
        var len = obj.length;
        // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
        if (len == '15') {
          var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
          var arr_data = obj.match(re_fifteen);
          var year = arr_data[2];
          var month = arr_data[3];
          var day = arr_data[4];
          var birthday = new Date('19' + year + '/' + month + '/' + day);
          return verifyBirthday('19' + year, month, day, birthday);
        }
        // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
        if (len == '18') {
          var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
          var arr_data = obj.match(re_eighteen);
          var year = arr_data[2];
          var month = arr_data[3];
          var day = arr_data[4];
          var birthday = new Date(year + '/' + month + '/' + day);
          return verifyBirthday(year, month, day, birthday);
        }
        return false;
      };

      // 校验日期
      var verifyBirthday = function (year, month, day, birthday) {
        var now = new Date();
        var now_year = now.getFullYear();
        // 年月日是否合理
        if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
          // 判断年份的范围（3岁到100岁之间)
          var time = now_year - year;
          if (time >= 0 && time <= 130) {
            return true;
          }
          return false;
        }
        return false;
      };

      // 校验位的检测
      var checkParity = function (obj) {
        // 15位转18位
        obj = changeFivteenToEighteen(obj);
        var len = obj.length;
        if (len == '18') {
          var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
          var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
          var cardTemp = 0, i, valnum;
          for (i = 0; i < 17; i++) {
            cardTemp += obj.substr(i, 1) * arrInt[i];
          }
          valnum = arrCh[cardTemp % 11];
          if (valnum == obj.substr(17, 1)) {
            return true;
          }
          return false;
        }
        return false;
      };

      // 15位转18位身份证号
      var changeFivteenToEighteen = function (obj) {
        if (obj.length == '15') {
          var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
          var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
          var cardTemp = 0, i;
          obj = obj.substr(0, 6) + '19' + obj.substr(6, obj.length - 6);
          for (i = 0; i < 17; i++) {
            cardTemp += obj.substr(i, 1) * arrInt[i];
          }
          obj += arrCh[cardTemp % 11];
          return obj;
        }
        return obj;
      };

      // 校验长度，类型
      if (isCardNo(idNumber) === false) {
        return false;
      }
      // 检查省份
      if (checkProvince(idNumber) === false) {
        return false;
      }
      // 校验生日
      if (checkBirthday(idNumber) === false) {
        return false;
      }
      // 检验位的检测
      if (checkParity(idNumber) === false) {
        return false;
      }
      return true;
    }
  }
}
