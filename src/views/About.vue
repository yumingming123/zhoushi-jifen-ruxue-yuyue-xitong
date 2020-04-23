<template>
  <div class="about">
    <div class="head-line">
      <img src="@/assets/icon/arrow-l.png" @click="logout" alt />
      <h2>周市镇积分入学窗口审核预约</h2>
      <!-- <img src="@/assets/icon/edit.png" @click="showForm" alt /> -->
      <span @click="showForm">修改</span>
    </div>
    <div class="main-content">
      <div class="user-info">
        <p>
          <span>姓名：</span>
          <span>{{obj.xm}}</span>
        </p>
        <p>
          <span>证件类型：</span>
          <span>{{obj.zjlx}}</span>
        </p>
        <p>
          <span>证件号码：</span>
          <span>{{obj.zjhm}}</span>
        </p>
        <p>
          <span>积分主体手机号：</span>
          <span>{{obj.jfztphone}}</span>
        </p>
        <p>
          <span>学校名称：</span>
          <span>{{obj.yyxx}}</span>
        </p>
        <p>
          <span>预约时间段：</span>
          <span>{{orderDone.time}}</span>
        </p>
        <p>
          <span class="code">预约码：</span>
          <span class="code">{{orderDone.code}}</span>
        </p>
      </div>
      <div class="orderTimeTable">
        <div class="orderDate">
          <span
            v-for="(item,index) in yuyueTable"
            :key="item.time"
            :class="index == choseDate ? 'date-act':''"
            @click="transDateList(item, index)"
          >{{item.time}}</span>
        </div>
        <div class="order-list">
          <p>
            <span>时间段</span>
            <!-- <span>剩余号</span> -->
            <span>预约状态</span>
          </p>
          <p v-for="item in timeList" :key="item.id" class="timeTable">
            <span>{{item.yysjd}}</span>
            <!-- <span>{{item.sl - item.yysl}}</span> -->
            <span
              @click="yuyue(item, $event)"
              :class="item.done ? 'isDone': (item.sl - item.yysl == 0)? 'isOver': 'yuyue'"
            >{{ item.done ? item.done :( item.sl - item.yysl == 0? '已满': '点击预约')}}</span>
          </p>
        </div>
      </div>
      <div class="timeTableOver" v-show="todayOver">
        <h3>请于工作日</h3>
        <h3 style="color: red">06:00 ~ 16:00</h3>
        <h3>进行预约</h3>
      </div>
      <div class="question">
        <p>
          预约时如有疑问请联系
          <br />
          <a href="tel:17312592293">17312592293</a> (工作时间：正常工作日08:30-16:30)
        </p>
      </div>
    </div>
    <!-- 修改信息弹窗 -->
    <div class="formDemo" v-show="isFormShow">
      <div class="form">
        <h2>预约信息登记</h2>
        <p>学校</p>
        <div class="radio">
          <div class="radio-item" v-for="item in schoolOption" :key="item">
            <input
              class="radioSchool"
              type="radio"
              :checked="(obj.yyxx == item ? true : false)"
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
              :checked="(obj.zjlx == item ? true : false)"
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

export default {
  data() {
    return {
      obj: {
        yyxx: "",
        xm: "",
        zjlx: "",
        zjhm: "",
        jfztphone: "",
        phone: ""
      },
      orderDone: {
        time: "",
        code: ""
      },
      isFormShow: false, //  个人信息修改的弹窗  控制显示还是隐藏
      showPicker: false,
      showIdOption: false,
      idTypeOption: ["身份证", "台胞证", "护照"],
      form: {},
      zjhmReg: /^\d{6}(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}[0-9xX]$/,
      jfztphoneReg: /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/,
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

      yuyueLog: null, // 预约记录
      yuyueTable: [], // 三天的预约时刻表
      timeNow: null, // 当前时间   服务返回的时间
      timeList: [], // 选择某天的时刻表
      choseDate: 0, // 选择的某一天   下标
      todayOver: false, // 判断今天所有时间段是否过了
      minuteNow: 0, // 用于 每分钟  刷新预约时刻表
      timer: null // 用于每分钟请求预约时刻表
    };
  },
  watch: {
    "orderDone.time": {
      handler(newval, oldval) {
        setTimeout(() => {
          var timeTable = document.querySelectorAll(".timeTable");
          timeTable = Array.from(timeTable);
          // console.log(timeTable);
          var date = this.orderDone.time.split(" ")[0]; // 预约记录的日期
          // console.log(this.yuyueTable[0].time === date);
          if (this.yuyueTable.length !== 0) {
            if (this.yuyueTable[0].time === date) {
              var time = this.orderDone.time.split(" ")[1];
              var index = timeTable.findIndex(
                // 如果预约时间已过 则找不到  做个判断
                // 查找  时刻表  内对应的  时刻下标
                el => el.children[0].innerText === time
              );
              // console.log(index);
              if (index !== -1) {
                timeTable[index].children[1].innerText = "预约成功";
                timeTable[index].children[1].style.color = "#19bf03";
              }
            }
          }
          // for (let i = 0; i < timeTable.length; i++) {
          //   var text = timeTable[i].children[0].innerText;
          //   console.log(text);
          //   if (text === time) {
          //     console.log(i);
          //   }
          // }
        }, 1000);
      },
      deep: true
    }
  },
  methods: {
    getYuYueList() {
      return new Promise((resolve, reject) => {
        api
          .getYuYueList({ phone: this.obj.phone, xxmc: this.obj.yyxx })
          .then(res => {
            // console.log(res.data);
            if (res.data.jsonData) {
              // 当用户可以拿到 预约时刻表、 时间戳 和 个人id时   表明登录未超时
              this.timeNow = res.data.jsonData.curDay;
              if (res.data.jsonData.yy.length !== 0) {
                // 当预约时刻表不为空时   就可以继续预约
                this.todayOver = false;
                // this.obj.parentid = res.data.jsonData.parentid;
                this.yuyueTable = res.data.jsonData.yy;
                this.timeList = res.data.jsonData.yy[0].yyLogList;
              } else {
                // 当 预约时刻表 为空 时  也就是当天的所有时刻已完成
                this.todayOver = true;
              }
            } else {
              this.$toast("请重新登录");
              setTimeout(() => {
                this.$router.replace("/");
                console.log("预约列表获取失败");
              }, 1500);
            }
            resolve(); // 不论丢不丢值出来  resolve 必须有  不然使用不了
          });
      });
    },
    // 格式化时间戳     自定义返回  年月日时分秒
    formatDate(date) {
      var now = new Date(date);
      var year = now.getFullYear();
      // var year = now.getYear();     //  为啥是120
      // console.log(year);
      var month = now.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var date = now.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return month + "-" + date;
    },
    // 退出登录
    logout() {
      console.log("退出登录");
      this.$dialog
        .confirm({
          title: "温馨提示",
          message: "是否退出登录"
        })
        .then(() => {
          // on confirm
          this.$router.replace("/");
        })
        .catch(() => {});
    },
    // 点击日期  换时间段列表
    transDateList(val, index) {
      this.choseDate = index;
      this.timeList = this.yuyueTable[index].yyLogList;
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
    getNetTime() {
      return new Promise((resolve, reject) => {
        api.getNetTime().then(res => {
          resolve(res.data.jsonData);
        });
      });
    },
    async yuyue(item, val) {
      if (item.sl - item.yysl === 0) {
        this.$toast({ message: "预约已满，请换一个时间段" });
        return;
      }
      // 时间校验    开放时间   6：00 - 16：00
      // var timeNow = this.timeNow;
      var timeNow = await this.getNetTime(); // await 对返回的是  promise对象才会有等待的效果

      var hour = new Date(timeNow).getHours();
      console.log(timeNow, hour);
      console.log(hour >= 6 && hour < 16);
      if (!(hour >= 6 && hour < 16)) {
        this.$toast("系统未开放，请于每天6点到16点预约");
        return;
      }

      var yuyueLog = JSON.parse(localStorage.getItem("userInfo")).yyLogList; // 预约上的记录
      // console.log(yuyueLog[0]);
      // var timeNow = new Date().getTime();    //  当前时间
      if (yuyueLog.length !== 0) {
        // 如果本地缓存不存在预约记录   直接放行   否则校验预约的时间和当前时间做比较
        // console.log(
        //   this.formatDate(yuyueLog[0].yyrq),
        //   this.formatDate(this.timeNow)
        // );
        if (
          this.formatDate(yuyueLog[0].yyrq) >= this.formatDate(this.timeNow)
        ) {
          var temp =
            yuyueLog[0].yyxx +
            "\n" +
            this.formatDate(yuyueLog[0].yyrq) +
            " " +
            yuyueLog[0].yysjd +
            "\n";
          this.$toast({
            message: "您已预约过" + temp + "请勿重复预约",
            duration: 3000
          });
          return;
        }
      }

      this.$dialog
        .confirm({
          title: "您预约的时间段为",
          message: item.xxmc + " " + item.yysjd
        })
        .then(() => {
          // on confirm
          // return;

          // 检验预约前  判断是否超过  后台设置的  30分钟之后操作  否则退出登录
          api
            .getYuYueList({ phone: this.obj.phone, xxmc: this.obj.yyxx })
            .then(res => {
              if (res.data.success) {
                // console.log(res.data);

                var jsonData = {
                  parentid: this.obj.id,
                  resourceid: item.id,
                  phone: this.obj.phone,
                  xm: this.obj.xm,
                  sfz: this.obj.zjhm,
                  yyxx: this.obj.yyxx,
                  yyrq: item.yyrq,
                  yysjd: item.yysjd
                };
                // 发送 预约  请求
                api.getYuYue({ jsonData }).then(res => {
                  console.log(res);
                  if (res.data.success) {
                    this.$toast.success("预约成功");

                    // 预约成功后修改当前的   预约信息    并更改本地存储的
                    var time = this.formatDate(res.data.jsonData.yyrq);
                    this.orderDone = {
                      time: time + " " + res.data.jsonData.yysjd,
                      code: res.data.jsonData.yybh
                    };
                    // 把返回后的预约信息存入本地存储的个人信息中的预约记录内
                    let local = JSON.parse(localStorage.getItem("userInfo"));
                    local.yyLogList[0] = res.data.jsonData;
                    localStorage.setItem("userInfo", JSON.stringify(local));

                    // 预约成功后刷新数据    让剩余号减一
                    this.getYuYueList();
                  } else {
                    this.$toast.fail("预约失败");
                    this.getYuYueList(); // 预约失败也获取一下最新的预约表
                  }
                });
              } else {
                this.$toast("请重新登录");
              }
            })
            .catch(error => {
              console.log(error);
              this.getYuYueList();
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 设置 已 预约上的  字样      为什么写成异步，  因为ajax获取数据需要时间
    async setYuYueDone() {
      await this.getYuYueList();
      console.log(this.yuyueLog);
      if (this.yuyueLog == null) {
        // 如果没有预约记录则  不进行后面的 替换工作
        return;
      }
      var dateIndex = this.yuyueTable.findIndex(el => {
        // console.log(el.yyLogList[0].yyrq);
        el.yyLogList[0].yyrq === this.yuyueLog.yyrq;
      });
      // console.log(dateIndex);

      if (dateIndex !== -1) {
        var timeIndex = this.yuyueTable[dateIndex].yyLogList.findIndex(
          el => el.yysjd === this.yuyueLog.yysjd
        );
        var date = this.yuyueTable[dateIndex].time;
        // console.log(date, timeIndex);
        this.yuyueTable[dateIndex].yyLogList[timeIndex].done = "预约成功";
        // console.log(this.yuyueTable)
      }
    },
    showForm() {
      this.isFormShow = true;
      Object.assign(this.form, this.obj);
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
        if (this.form.xm.length > 10) {
          // 也可以直接在input输入框使用maxlength属性进行限制
          this.$toast.fail("积分主体姓名长度过长");
          return;
        }
        // if (this.form.jfztphone) {
        var isjfztphoneRight = this.jfztphoneReg.test(this.form.jfztphone);
        if (!isjfztphoneRight) {
          this.$toast.fail("积分主体手机号格式有误");
          return;
        }
        // }

        api.saveInfo({ jsonData: this.form }).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$toast.success({
              message: "个人信息修改成功",
              overlay: true
            });

            // 可以手动更改用户数据  但  为了省事省力  省麻烦    还是用户重新登录比较好
            // var local = JSON.parse(localStorage.getItem('userInfo'));

            localStorage.setItem("userInfo", JSON.stringify(res.data.jsonData));
            // setTimeout(() => {
            // this.$router.replace("/");
            console.log("表单信息更改了");
            // }, 1500);

            this.isFormShow = false;

            // 重新渲染一下时刻表   和  个人信息   预约记录的显示
            this.init();
          } else {
            this.$toast.fail("个人信息修改出错");
          }
        });
      }
    },
    chooseSchool(item) {
      console.log(item);
      this.form.yyxx = item;
    },
    chooseZjlx(item) {
      console.log(item);
      this.form.zjlx = item;
    },
    async init() {
      // 把网络上预约到的时间和日期渲染到页面上
      var userInfo = JSON.parse(localStorage.getItem("userInfo"));
      // console.log(userInfo);

      this.obj = {
        yyxx: userInfo.yyxx,
        xm: userInfo.xm,
        zjlx: userInfo.zjlx,
        zjhm: userInfo.zjhm,
        jfztphone: userInfo.jfztphone,
        phone: userInfo.phone,
        id: userInfo.id
      };

      await this.getYuYueList(); // 因为后面需要 拿到 预约时刻表 内的数据  所以需要做成异步改同步

      // 如果未预约  则显示空
      if (userInfo.yyLogList) {
        // 如果  预约记录存在
        if (userInfo.yyLogList.length !== 0) {
          // 并且长度为零
          this.yuyueLog = userInfo.yyLogList[0];

          // console.log(this.yuyueLog);
          // 如果预约信息的学校 和 个人信息 选的学校不一致  则不需要填充预约信息
          if (this.yuyueLog.yyxx === this.obj.yyxx) {
            // 还要判断预约的时间  是否已经过期    过期就不显示
            var date = this.formatDate(this.yuyueLog.yyrq); // 预约记录内的日期
            // console.log(this.yuyueTable); // 当前预约表内的日期
            if (date > this.yuyueTable[0].time) {
              // 预约记录 内的日期  和  预约表内的日期进行比较   过期则不显示
              this.orderDone = {
                time: date + " " + this.yuyueLog.yysjd,
                code: this.yuyueLog.yybh
              };
            } else {
              this.orderDone = {
                time: "",
                code: ""
              };
            }
          } else {
            // 如果 不一样  则需要清空上一次遗留的  预约时间段 和 预约码
            this.orderDone = {
              time: "",
              code: ""
            };
          }
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      var timeTable = document.querySelectorAll(".timeTable");
      // console.log(timeTable);
    });
    this.$nextTick(() => {
      var timeTable = document.querySelectorAll(".timeTable");
      // timeTable = Array.from(timeTable);
      // console.log(timeTable);
    });
    // document.querySelector('html')
  },
  updated() {
    var timeTable = document.querySelectorAll(".timeTable");
    // console.log(timeTable);
  },
  created() {
    this.init();

    // 控制一下背景颜色
    var body = document.querySelector("body");
    body.style.backgroundColor = "#f2f2f2";

    var minute = new Date().getMinutes();
    this.minuteNow = minute; // 减少初次的第二次没必要的请求

    this.timer = setInterval(() => {
      // 使得预约列表每分钟刷新
      var minute = new Date().getMinutes();
      // console.log(minute);
      // console.log(minute !== this.minuteNow);

      // this.timeList = [];
      // this.yuyueTable = [];
      // this.todayOver = true;

      if (minute !== this.minuteNow) {
        this.minuteNow = minute;
        this.getYuYueList();
      }
    }, 2000);

    setTimeout(() => {}, 2000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
.about {
  // position: relative;
  // width: 100%;
  background-color: #f2f2f2;
  font-size: 12px;
  .head-line {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    color: white;
    font-size: 12px;
    font-family: PingFangSC-Regular, sans-serif;
    background-color: #109beb;
    h2 {
      padding: 0;
    }
    img {
      width: 20px;
      height: 20px;
    }
    span {
      display: inline-block;
      height: 30px;
      width: 40px;
      line-height: 30px;
    }
  }
  .main-content {
    padding: 16px;
    box-sizing: border-box;
    background-color: #f2f2f2;
    .user-info {
      margin-bottom: 16px;
      padding: 10px 30px;
      width: 100%;
      height: 187px;
      border-radius: 20px;
      box-sizing: border-box;
      background-color: #fff;
      p {
        width: 100%;
        text-align: left;
        margin: 6px 0;
        span:nth-child(1) {
          display: inline-block;
          width: 100px;
          padding-right: 10px;
          text-align: right;
        }
        .code {
          color: #19bf03;
          font-weight: bolder;
        }
      }
    }
    .orderTimeTable {
      width: 100%;
      background-color: #e5e5e5;
      .orderDate {
        width: 100%;
        span {
          display: inline-block;
          width: 100%;
          height: 34px;
          line-height: 34px;
          &.date-act {
            // background-color: #fff;
            background-color: #e5e5e5;
          }
        }
      }
      .order-list {
        width: 100%;
        background-color: #fff;
        p {
          span {
            display: inline-block;
            width: 50%;
            height: 34px;
            line-height: 34px;
            &.yuyue {
              color: #109beb;
              // font-weight: bolder;
              // font-weight: lighter;
            }
            &.isOver {
              color: #ccc;
              font-weight: lighter;
            }
            &.isDone {
              // color: #08fb24;
              font-weight: lighter;
            }
          }
        }
      }
    }
    .question {
      margin-top: 10px;
      line-height: 20px;
      // color: red;
      a {
        // color: red;
      }
    }
    .timeTableOver {
      margin-top: 20px;
      height: 389px;
      width: 100%;
      border-radius: 20px;
      background: #fff url("~@/assets/img/background.svg") no-repeat bottom
        center/contain;
      overflow: hidden;
      h3 {
        margin-bottom: 22px;
        font-size: 15px;
        font-weight: normal;
        &:first-child {
          margin-top: 77.5px;
        }
        &:last-child {
          margin-bottom: 74px;
        }
      }
    }
  }
  .formDemo {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
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