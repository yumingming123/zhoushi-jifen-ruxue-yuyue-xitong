<template>
  <div class="home">
    <div class="main-content">
      <h2>周市镇积分入学窗口审核预约</h2>
      <div class="telSort">中国大陆 86</div>
      <div class="telDiv">
        <input type="tel" id="phone" placeholder="请输入手机号" v-model="phone" />
      </div>
      <div class="codeLine">
        <input type="number" id="code" placeholder="请输入验证码" v-model="code" />
        <button class="getCode" :disabled="isPress" @click="getCode">{{btn}}</button>
      </div>
      <van-button type="info" size="large" @click="login">登录</van-button>
      <h1 class="beizhu">备注：</h1>
      <p>1. 预约时间：每天上午6:00到下午4:00预约审核号;</p>
      <p>2. 由于当天预约，预约成功后，暂不支持取消和修改;</p>
      <p>3. 预约后如果爽约两次及以上将无法进行网上预约;</p>
    </div>
    <div class="formDemo" v-show="isFormShow">
      <div class="form">
        <h2>预约信息登记</h2>
        <p>学校</p>
        <div class="radio">
          <div class="radio-item" v-for="item in schoolOption" :key="item">
            <input
              class="radioSchool"
              type="radio"
              name="yyxx"
              :data-school="item"
              @change="chooseSchool(item)"
            />
            <span>{{item}}</span>
          </div>
        </div>
        <!-- <van-field name="yyxx" label="学校"> -->
        <!-- <template #input> -->
        <!-- <van-radio-group v-model="form.yyxx" direction="horizontal">
              <van-radio icon-size="50px" :name="item" v-for="item in schoolOption" :key="item">{{item}}</van-radio>
        </van-radio-group>-->
        <!-- </template> -->
        <!-- </van-field> -->
        <p class="zjlx">证件类型</p>
        <div class="radio-zjlx">
          <div class="radio-item-zjlx" v-for="item in idTypeOption" :key="item">
            <input
              class="radioZjlx"
              type="radio"
              name="zjlx"
              :data-school="item"
              @change="chooseZjlx(item)"
            />
            <span>{{item}}</span>
          </div>
        </div>
        <van-field v-model="form.zjhm" placeholder="证件号码" />
        <van-field v-model="form.xm" placeholder="积分主体姓名（家长）" />
        <van-field v-model="form.jfztphone" placeholder="积分主体手机号" />
        <div class="bot-btn">
          <van-button type="info" class="submitInfo" @click="isFormShow = false">取消</van-button>
          <van-button type="info" class="submitInfo" @click="submitInfo">提交</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api.js";
import vue from "vue";

export default {
  name: "home",
  data() {
    return {
      btn: "发送动态验证码",
      isPress: false,
      phone: "",
      code: "",
      isFormShow: false,
      schoolOption: [
        "新镇中学",
        "周市中学",
        "周市中心小学",
        "新镇中心小学",
        "周市镇永平小学",
        "周市镇春晖小学",
        "周市华城美地小学",
        "陆杨中心小学",
        "裕元实验学校(东、西校区)"
      ],
      showPicker: false,
      showIdOption: false,
      idTypeOption: ["身份证", "台胞证", "护照"],
      form: {
        yyxx: "",
        xm: "",
        zjlx: "",
        zjhm: "",
        jfztphone: ""
      },
      zjhmReg: /^\d{6}(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}[0-9xX]$/,
      jfztphoneReg: /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/
      // pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    };
  },
  methods: {
    getCode() {
      // // 时间校验    开放时间   18：00 - 23：00
      // var timeNow = new Date();
      // var hour = timeNow.getHours();
      // // console.log(hour >= 18 && hour < 23);
      // if (!(hour >= 6 && hour < 16)) {
      //   this.$toast("系统未开放，请于每天6点到16点登录");
      //   return;
      // }

      var phoneRight = this.jfztphoneReg.test(this.phone);
      if (!phoneRight) {
        this.$toast.fail("手机号格式有误");
        return;
      }

      this.isPress = true; // 开启禁用
      this.btn = "5 s 后";
      var time = 5;
      var timer = setInterval(() => {
        time--;
        this.btn = time + " s 后";
        if (time == -1) {
          clearInterval(timer);
          this.btn = "发送动态验证码";
          this.isPress = false; // 恢复禁用
        }
      }, 1000);

      api.getCode({ phone: this.phone }).then(res => {
        // console.log(res);
      });
    },
    login() {
      // // 时间校验    开放时间   18：00 - 23：00
      // var timeNow = new Date();
      // var hour = timeNow.getHours();
      // // console.log(hour >= 18 && hour < 23);
      // if (!(hour >= 6 && hour < 16)) {
      //   this.$toast("系统未开放，请于每天6点到16点登录");
      //   return;
      // }

      var phoneRight = this.jfztphoneReg.test(this.phone);
      if (!phoneRight) {
        this.$toast.fail("手机号格式有误");
        return;
      }

      console.log(this.code);
      console.log(this.code.length < 6);
      if (this.code === "") {
        this.$toast.fail("验证码不能为空");
        return;
      } else if (this.code.length < 6) {
        this.$toast.fail("验证码格式不对");
        return;
      }

      // this.$toast('hahah')
      api.checkCode({ phone: this.phone, code: this.code }).then(res => {
        console.log(res);
        if (res.data.success === false) {
          this.$toast.fail({ message: "验证码错误", overlay: true });
        } else {
          this.$toast.success({
            message: "验证成功",
            overlay: true,
            duration: 1500
          });
          if (res.data.jsonData === null) {
            // 如果后台查询到该手机号未注册  则弹出注册界面
            setTimeout(() => {
              this.isFormShow = true;
            }, 2000);
          } else {
            setTimeout(() => {
              // 否则跳转到预约界面
              this.$router.push("/about");
              localStorage.setItem(
                "userInfo",
                JSON.stringify(res.data.jsonData)
              );
            }, 2000);
          }
        }
      });
    },
    chooseSchool(item) {
      console.log(item);
      this.form.yyxx = item;
    },
    chooseZjlx(item) {
      console.log(item);
      this.form.zjlx = item;
    },
    // 粗略校验 身份证号码   idCard 身份证号
    isIdCard(idCard) {
      if (!idCard || idCard.length != 18) {
        return false;
      }
      /*
       * 11北京| 12天津| 13河北| 14山西| 15内蒙古|21辽宁| 22吉林| 23黑龙江|31上海| 32江苏| 33浙江|
       * 34安徽| 35福建| 36江西| 37山东| 41河南| 42湖北| 43湖南| 44广东| 45广西| 46海南| 50重庆|
       * 51四川| 52贵州| 53云南| 54西藏| 61陕西| 62甘肃| 63青海| 64宁夏| 65新疆|
       * (未加入限制：71台湾|81香港|82澳门|91国外)
       */
      // 粗略的校验
      var regex = /^(11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)(\d{4})(19|20|21)(\d{2})(1[0-2]|0[1-9])(0[1-9]|[1-2][0-9]|3[0-1])(\d{3})(\d{1}|X|x)$/;
      return regex.test(idCard);
    },
    // 精确校验 身份证号码   idCard 身份证号
    isIdCardStrict(idCard) {
      if (!this.isIdCard(idCard)) {
        // 先进行粗略校验
        return false;
      }
      /* 粗略校验通过后，必定有18位字符，对身份证的最后一位校验码进行验证 */
      var prefix = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      ); // 加权因子数组
      var suffix = new Array(
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      ); // 校验码数组，其中X为10
      var wiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
      for (var i = 0; i < 17; i++) {
        wiSum += parseInt(idCard[i]) * prefix[i];
      }
      var wiMod = wiSum % 11; // 计算出校验码所在数组的位置
      var code = suffix[wiMod]; // 从数组中得到校验码，如果wiMod等于2，则说明校验码是10，身份证号码最后一位应该是X
      var idCardLast = idCard[17].toUpperCase(); // 获取身份证号码的最后一位，最后一位是校验码
      // 用计算出来的校验码与最后一位身份证号码比较，如果相等，说明验证通过，否则是无效的身份证号码
      return code == idCardLast;
    },
    // 弹出层的提交资料按钮
    submitInfo() {
      console.log(this.form);
      if (
        this.form.yyxx === "" ||
        this.form.xm === "" ||
        this.form.zjlx === "" ||
        this.form.zjhm === "" ||
        this.form.jfztphone === ""
      ) {
        this.$toast.fail("表单内容不能有空");
        return;
      } else {
        if (this.form.zjlx === "身份证") {
          // var isZjhmRight = this.zjhmReg.test(this.form.zjhm);
          var isZjhmRight = this.isIdCardStrict(this.form.zjhm);
          if (!isZjhmRight) {
            this.$toast.fail("身份证号格式有误");
            return;
          }
        } else {
          if (this.form.zjhm.length < 8) {
            this.$toast.fail("证件号码格式有误");
            return;
          }
        }
        // console.log(this.form.xm.length)
        if(this.form.xm.length > 10){
          this.$toast.fail("积分主体姓名长度过长");
          return
        }
        // if (this.form.jfztphone) {
          var isjfztphoneRight = this.jfztphoneReg.test(this.form.jfztphone);
          if (!isjfztphoneRight) {
            this.$toast.fail("积分主体手机号格式有误");
            return;
          }
        // }
        


        var jsonData = {
          ...this.form,
          phone: this.phone
        };
        api.saveInfo({ jsonData }).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$toast.success("注册成功");
            this.$router.push("/about");
            localStorage.setItem("userInfo", JSON.stringify(res.data.jsonData));
          } else {
            this.$toast.fail("证件号码已存在");
          }
        });
      }
    }
  },
  created() {
    // console.log(vue.prototype)
    setTimeout(() => {

      // window.location.reload()    // 重新加载页面会干扰用户操作
    }, 2000)


    // 控制一下背景颜色
    var body = document.querySelector('body');
    body.style.backgroundColor = '#fff';

  }
};
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  overflow: hidden;
  ::-webkit-input-placeholder {
    /*Webkit browsers 谷歌*/
    color: #ccc;
  }

  :-moz-placeholder {
    /*Mozilla Firefox 4 to 8 火狐*/
    color: rgba(164, 164, 164, 1);
  }

  ::moz-placeholder {
    /*Mozilla Firefox 19+ 火狐*/
    color: rgba(164, 164, 164, 1);
  }

  :-ms-input-placeholder {
    /*Internet Explorer 10+ IE10以上*/
    color: rgba(164, 164, 164, 1);
  }
  .main-content {
    h2 {
      margin: 44px 0 32px;
      height: 64px;
      font-size: 24px;
      line-height: 64px;
    }
    .telSort {
      margin-bottom: 10px;
      height: 42.5px;
      font-size: 13px;
      line-height: 42.5px;
      text-align: left;
      border-bottom: 1px solid gray;
    }
    .telDiv {
      margin-bottom: 10px;
      border-bottom: 2px solid rgb(187, 187, 187);
      #phone {
        width: 100%;
        height: 42.5px;
        border: 0;
        font-size: 15px;
        outline: none;
        // border-bottom: 2px solid gray;
      }
    }
    .codeLine {
      margin-bottom: 50px;
      width: 100%;
      height: 43.5px;
      border-bottom: 1px solid gray;
      #code {
        width: 70%;
        height: 42.5px;
        border: 0;
        font-size: 15px;
        outline: none;
      }
      .getCode {
        width: 30%;
        height: 42.5px;
        font-size: 11px;
        border: none;
        outline: none;
        background-color: #fff;
      }
    }

    .beizhu {
      margin-top: 20px;
      font-size: 13px;
      font-weight: lighter;
      text-align: left;
    }

    p {
      text-align: left;
      margin-top: 10px;
      font-size: 12px;
      color: red;
    }
  }

  .formDemo {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 15px;
    background-color: rgba(0, 0, 0, 0.5);
    .form {
      padding: 40px 20px 20px;
      width: 343px;
      height: 600px;
      border-radius: 20px;
      box-sizing: border-box;
      background-color: #fff;
      h2 {
        margin-bottom: 22px;
      }
      p {
        margin-bottom: 20px;
        font-size: 15px;
        text-align: left;
      }
      .zjlx {
        margin-top: 5.5px;
      }
      .radio {
        display: flex;
        flex-wrap: wrap;
        // background-color: red;
        .radio-item {
          display: flex;
          margin-bottom: 11px;
          width: 50%;
          height: 16.5px;
          line-height: 16.5px;
          text-align: left;
          .radioSchool {
            margin-right: 10px;
            width: 16.5px;
            height: 16.5px;
            opacity: 0.7;
            // border: 1px solid gray;
          }
          &:nth-child(9) {
            width: 100%;
          }
        }
      }
      .radio-zjlx {
        display: flex;
        .radio-item-zjlx {
          display: flex;
          margin-bottom: 11px;
          width: 50%;
          height: 16.5px;
          line-height: 16.5px;
          text-align: left;
          .radioZjlx {
            margin-right: 10px;
            width: 16.5px;
            height: 16.5px;
            opacity: 0.7;
          }
        }
      }
      .van-field {
        padding-left: 0;
        padding-right: 0;
        border-bottom: 1px solid #cccccc;
        .van-cell__title.van-field__label {
          width: 31px;
        }
      }
      .bot-btn {
        margin-top: 30px;
        .submitInfo {
          margin: 0 40px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>