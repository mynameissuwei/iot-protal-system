<template>
  <div class="login">
    <!-- <nav :class="nav_show"></nav> -->
    <div class="box">
      <!-- <div>返回首页</div> -->

      <!-- 登陆表单 -->
      <el-card class="container-login" ref="loginCard">
        <el-button class="goHome" type="text" @click="goHome"
          >返回首页</el-button
        >
        <div class="headerToggle">
          <h2>欢迎使用恩牛网物联平台</h2>
        </div>
        <el-tabs v-model="activeName" v-if="this.windwBoxBtn == 1">
          <el-tab-pane
            :label="authText"
            name="zero"
            class="class-filter"
            v-if="isAuth ? defaultLogin == '0' : false"
          >
            <el-form
              ref="loginFormRefA"
              :rules="LoginFormRulesP"
              :model="loginForm1"
              label-width="0"
              class="login_form"
            >
              <el-form-item prop="account" key="account">
                <el-input
                  placeholder="请输入账号"
                  v-model.psw.trim="loginForm1.account"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password" key="password">
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  v-model.psw.trim="loginForm1.password"
                  suffix-icon="el-icon-lock"
                ></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button
                  class="btn-color"
                  type="primary"
                  round
                  @click="loginTo(true)"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="密码登录" name="first" class="class-filter">
            <el-form
              ref="loginFormRefA"
              :rules="LoginFormRulesP"
              :model="loginForm1"
              label-width="0"
              class="login_form"
            >
              <el-form-item prop="account" key="account">
                <el-input
                  placeholder="请输入账号"
                  v-model.psw.trim="loginForm1.account"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password" key="password">
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  v-model.psw.trim="loginForm1.password"
                  suffix-icon="el-icon-lock"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item style="text-align: left">
                  <el-checkbox v-model="isRemember">
                    记住密码
                  </el-checkbox>
                </el-form-item> -->
              <el-form-item class="btns">
                <el-button
                  class="btn-color"
                  type="primary"
                  round
                  @click="loginTo(false)"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="second">
            <el-form
              ref="codeLoginFormRef"
              :model="codeLoginForm"
              :rules="codeLoginFormRules"
              label-width="0"
              class="login_form"
            >
              <el-form-item prop="mobile" key="mobile">
                <el-input
                  placeholder="请输入手机号"
                  v-model="codeLoginForm.mobile"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
              <el-form-item prop="smsCaptcha" key="smsCaptcha">
                <el-input
                  placeholder="请输入短信验证码"
                  v-model="codeLoginForm.smsCaptcha"
                >
                  <el-button
                    slot="append"
                    type="primary"
                    plain
                    @click="getRegisterCode(codeLoginForm.mobile, 'login')"
                    :disabled="isDisabled"
                    >{{ buttonName }}</el-button
                  >
                </el-input>
              </el-form-item>
              <!-- <el-form-item style="text-align: left">
                  <el-checkbox v-model="isRemember">
                    记住密码
                  </el-checkbox>
                </el-form-item> -->
              <el-form-item class="btns">
                <el-button
                  class="btn-color"
                  type="primary"
                  round
                  @click="codeLoginTo"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            :label="authText"
            name="zero"
            class="class-filter"
            v-if="isAuth ? defaultLogin == '1' : false"
          >
            <el-form
              ref="loginFormRefA"
              :rules="LoginFormRulesP"
              :model="loginForm1"
              label-width="0"
              class="login_form"
            >
              <el-form-item prop="account" key="account">
                <el-input
                  placeholder="请输入账号"
                  v-model.psw.trim="loginForm1.account"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password" key="password">
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  v-model.psw.trim="loginForm1.password"
                  suffix-icon="el-icon-lock"
                ></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button
                  class="btn-color"
                  type="primary"
                  round
                  @click="loginTo(true)"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div class="pull-right">
          <el-button class="pull-btn-right" type="text">
            <span v-if="this.windwBoxBtn == 2" @click="toLogin()"
              >立即登录</span
            >
          </el-button>
        </div>
      </el-card>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {
  // loginUp,
  getLoginCaptcha,
  getLoginToken,
  // registerCodeApi,
  getLoginSmsCaptcha,
  codeLoginApi,
  ldapCheck,
} from "@/api";
import { Message } from "element-ui";

export default {
  name: "index",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginForm.checkPass !== "") {
          this.$refs.loginFormGegisterRef.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loginForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isAuth: false,
      authText: "LDAP",
      defaultLogin: "1",
      activeName: "first",
      // 短信验证码
      CountDown: 60, //倒计时
      buttonName: "获取验证码",
      isDisabled: false, //是否禁用按钮
      isRemember: false,
      nav_show: "",
      windwBox: "1",
      windwBoxBtn: "1",
      //  backgroundImg: require(''),
      // 登录表单
      authForm: {
        account: "",
        password: "",
      },
      loginForm1: {
        account: "",
        password: "",
      },
      codeLoginForm: {
        mobile: "",
        smsCaptcha: "",
      },
      loginForm: {
        account: "",
        password: "",
        smsCaptcha: "",
        checkPass: "",
        captcha: "",
        checked: [],
      },
      // 表单验证规则
      codeLoginFormRules: {
        // mobile: [{  required: true, message: "请输入短信验证码",trigger: "blur" }],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            min: 10,
            max: 11,
            message: "请正确输入手机号",
            trigger: "blur",
          },
        ],
        smsCaptcha: [
          {
            required: true,
            message: "请输入短信验证码",
            trigger: "blur",
          },
        ],
      },
      LoginFormRulesP: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur",
          },
          // {
          //   min: 6,
          //   max: 15,
          //   message: "长度在 6 到 15 个字符",
          //   trigger: "blur"
          // }
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
      loginFormRulesRegister: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur",
          },
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        smsCaptcha: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
        ],
        checked: [
          {
            type: "array",
            required: true,
            message: "请勾选协议",
            trigger: "change",
          },
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    ldapCheck().then((res) => {
      console.log(res, "LDAP已请求");
      const { code, data } = res;
      this.isAuth = code == 200 ? true : false;
      this.authText = data.moduleName;
      this.defaultLogin = data.defaultLogin;
      if (this.isAuth) {
        if (this.defaultLogin == "0") {
          this.activeName = "zero";
        }
      }
    });
    //从sessionStorage中读取倒计时
    if (sessionStorage.getItem("CountDownInfo")) {
      this.CountDown = JSON.parse(
        sessionStorage.getItem("CountDownInfo")
      ).CountDown;
      this.isDisabled = JSON.parse(
        sessionStorage.getItem("CountDownInfo")
      ).isDisabled;
    }
    //进入该页面时，若倒计时还在进行，则继续倒计时
    if (this.isDisabled) {
      let timerId = setInterval(() => {
        this.CountDown--;
        this.buttonName = this.CountDown + "秒后重试";
        if (this.CountDown <= 0) {
          clearInterval(timerId);
          this.buttonName = "重新发送";
          this.CountDown = 60;
          this.isDisabled = false;
        }
      }, 1000);
    }
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem(
        "CountDownInfo",
        JSON.stringify({
          CountDown: this.CountDown,
          isDisabled: this.isDisabled,
        })
      );
    });
  },
  mounted() {
    this.getCookie(); //判断cookie中的值
  },
  methods: {
    // 登录&注册获取短信验证码
    async getRegisterCode(mobile, type) {
      if (mobile) {
        //按钮禁止，并进行倒计时，防止网速慢的用户重复点击
        this.isDisabled = true;
        let timerId = setInterval(() => {
          this.CountDown--;
          this.buttonName = this.CountDown + "秒后重试";
          if (this.CountDown <= 0) {
            clearInterval(timerId);
            this.buttonName = "重新发送";
            this.CountDown = 60;
            this.isDisabled = false;
          }
        }, 1000);
        if (type) {
          // 登录验证码接口
          const res = await getLoginSmsCaptcha(mobile);
          console.log(res);
        }
      } else {
        this.$message.warning("请填写接收短信验证码的手机号");
      }

      // this.mobileCode = res.data.image;
    },

    // 记住密码
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split(";");
        for (var i = 0; i < arr.length; i++) {
          var userKey = arr[i].split("=");
          if (userKey[0].trim() == "userName") {
            this.loginForm1.account = userKey[1];
          } else if (userKey[0].trim() == "userPws") {
            this.loginForm1.password = userKey[1];
          } else if (userKey[0].trim() == "isRemember") {
            this.isRemember = Boolean(userKey[1]);
          }
        }
      }
    },
    //存储
    setCookie(userName, userPws, days) {
      var curDate = new Date();
      curDate.setTime(curDate.getTime() + 24 * 60 * 60 * 1000 * days); //设置cookie存储的有效时间
      window.document.cookie =
        "userName" +
        "=" +
        userName +
        ";path=/;expires=" +
        curDate.toGMTString();
      window.document.cookie =
        "userPws" + "=" + userPws + ";path=/;expires=" + curDate.toGMTString();
      window.document.cookie =
        "isRemember" +
        "=" +
        this.isRemember +
        ";path=/;expires=" +
        curDate.toGMTString();
    },
    //用户不选择记住密码清除cookie
    clearCookie() {
      this.setCookie("", "", -1);
    },
    submitForm() {
      //登录时判断是否选择记住密码，如果是则设置cookie不是清除cookie，再调用登录函数进行登录
      if (this.isRemember == true) {
        this.setCookie(this.loginForm1.account, this.loginForm1.password, 7);
      } else {
        this.clearCookie();
      }
      this.loginTo(); //调用登录函数
    },
    // 控制台登录地址重定向
    redirectFn() {
      let redirectVal = this.$urlParse.getUrlKey("redirect");
      console.log(window.location.search);
      let gdUrl = "https://feedback-workorder-web.dev.ennew.com/order-pool";
      let zcUrl = "https://data-asset-front.dev.ennew.com";
      let gdTenantId = "1369559970221985794";
      let zcTenantId = "1374980461627899905";
      let loginCode,
        authCode,
        userId,
        assetloginCode,
        assetAuthCode,
        assetUserId;
      // 生产环境控制台地址
      if (window.location.host.indexOf("newiot") != -1) {
        gdUrl = "https://feedback-workorder-web.ennew.com/order-pool";
        zcUrl = "https://data-asset-front.ennew.com";
        gdTenantId = "1518825105279848450";
        zcTenantId = "1381950445998632962";
      }
      // 测试环境
      if (window.location.href.indexOf("10.39.68.49") !== -1) {
        gdUrl = "https://feedback-workorder-web.fat.ennew.com/order-pool";
        zcUrl = "https://data-asset-front.fat.ennew.com";
      }
      if (window.location.search.indexOf("redirect") == -1) {
        this.$router.push("/");
      } else {
        let bladeAuthVal = localStorage.getItem("bladeAuthNew1");
        let tenantIdVal = localStorage.getItem("tenantId1");
        if (localStorage.getItem("loginCode")) {
          loginCode = localStorage.getItem("loginCode");
          authCode = localStorage.getItem("authCode");
          userId = localStorage.getItem("userId");
        }
        if (localStorage.getItem("assetloginCode")) {
          assetloginCode = localStorage.getItem("assetloginCode");
          assetAuthCode = localStorage.getItem("assetAuthCode");
          assetUserId = localStorage.getItem("assetUserId");
        }
        let workorderUrl = loginCode
          ? encodeURIComponent(
              `${gdUrl}?authTenantId=${gdTenantId}&authCode=${authCode}&loginCode=${loginCode}&rememberMe=0&isMobileLogin=2&userId=${userId}`
            )
          : "";
        let assetUrl = assetloginCode
          ? encodeURIComponent(
              `${zcUrl}?authTenantId=${zcTenantId}&authCode=${assetAuthCode}&loginCode=${assetloginCode}&rememberMe=0&isMobileLogin=2&userId=${assetUserId}`
            )
          : "";
        if (workorderUrl || localStorage.getItem("iotToken") || assetUrl) {
          let iotToken = localStorage.getItem("iotToken") || "";
          let itcode = localStorage.getItem("itcode") || "";
          let href = `${redirectVal}?bladeAuth=${bladeAuthVal}&tenantId=${tenantIdVal}&workorderUrl=${workorderUrl}&assetUrl=${assetUrl}&iotToken=${iotToken}&itcode=${itcode}`;
          window.open(href, "_self");
        } else {
          window.open(
            `${redirectVal}?bladeAuth=${bladeAuthVal}&tenantId=${tenantIdVal}`,
            "_self"
          );
        }
      }
    },
    async loginTo(isAuth) {
      this.$refs.loginFormRefA.validate(async (valid) => {
        if (!valid) return;
        const result = isAuth
          ? { ...this.loginForm1, grantType: "ldap" }
          : this.loginForm1;
        console.log(result, "result");
        const res = await getLoginToken(result);
        if (res.code == "200" && res.data.accessToken) {
          this.$message.success(`账号 ${this.loginForm1.account} 登录成功！`);
          localStorage.setItem("bladeAuthNew1", res.data.accessToken);
          localStorage.setItem("tenantId1", res.data.tenantId);
          localStorage.setItem("userNameNew", res.data.account);
          localStorage.setItem("iotToken", res.data["iot-token"]);
          localStorage.setItem("itcode", res.data.itcode);
          if (Object.keys(res.data.platformAuthInfo).length > 0) {
            localStorage.setItem(
              "loginCode",
              res.data.platformAuthInfo && res.data.platformAuthInfo.loginCode
            );
            localStorage.setItem(
              "authCode",
              res.data.platformAuthInfo &&
                res.data.platformAuthInfo.ennUnifiedGrantCodeCookie &&
                res.data.platformAuthInfo.ennUnifiedGrantCodeCookie.value
            );
            localStorage.setItem(
              "userId",
              res.data.platformAuthInfo && res.data.platformAuthInfo.userId
            );
          }
          if (Object.keys(res.data.assetPlatformAuthInfo).length > 0) {
            localStorage.setItem(
              "assetloginCode",
              res.data.assetPlatformAuthInfo &&
                res.data.assetPlatformAuthInfo.loginCode
            );
            localStorage.setItem(
              "assetAuthCode",
              res.data.assetPlatformAuthInfo &&
                res.data.assetPlatformAuthInfo.ennUnifiedGrantCodeCookie &&
                res.data.platformAuthInfo.ennUnifiedGrantCodeCookie.value
            );
            localStorage.setItem(
              "assetUserId",
              res.data.assetPlatformAuthInfo &&
                res.data.assetPlatformAuthInfo.userId
            );
          }
          this.redirectFn();
        }
      });
    },
    // 手机号登录
    async codeLoginTo() {
      let redirectVal = this.$urlParse.getUrlKey("redirect");
      this.$refs.codeLoginFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await codeLoginApi(this.codeLoginForm);
        console.log(res);
        if (res.code == "200" && res.data.accessToken) {
          this.$message.success("登录成功！");
          localStorage.setItem("bladeAuthNew1", res.data.accessToken);
          localStorage.setItem("tenantId1", res.data.tenantId);
          localStorage.setItem("userNameNew", res.data.account);
          localStorage.setItem("iotToken", res.data["iot-token"]);
          localStorage.setItem("itcode", res.data.itcode);
          if (Object.keys(res.data.platformAuthInfo).length > 0) {
            localStorage.setItem(
              "loginCode",
              res.data.platformAuthInfo && res.data.platformAuthInfo.loginCode
            );
            localStorage.setItem(
              "authCode",
              res.data.platformAuthInfo &&
                res.data.platformAuthInfo.ennUnifiedGrantCodeCookie &&
                res.data.platformAuthInfo.ennUnifiedGrantCodeCookie.value
            );
            localStorage.setItem(
              "userId",
              res.data.platformAuthInfo && res.data.platformAuthInfo.userId
            );
          }
          if (Object.keys(res.data.assetPlatformAuthInfo).length > 0) {
            localStorage.setItem(
              "assetloginCode",
              res.data.assetPlatformAuthInfo &&
                res.data.assetPlatformAuthInfo.loginCode
            );
            localStorage.setItem(
              "assetAuthCode",
              res.data.assetPlatformAuthInfo &&
                res.data.assetPlatformAuthInfo.ennUnifiedGrantCodeCookie &&
                res.data.platformAuthInfo.ennUnifiedGrantCodeCookie.value
            );
            localStorage.setItem(
              "assetUserId",
              res.data.assetPlatformAuthInfo &&
                res.data.assetPlatformAuthInfo.userId
            );
          }
          this.redirectFn();
        } else {
          // this.$message.warning(res.msg);
          return;
        }
      });
    },
    // async toRegister() {
    //   this.windwBox = "2";
    //   this.windwBoxBtn = "2";
    // },
    toLogin() {
      this.windwBox = "1";
      this.windwBoxBtn = "1";
      console.log(this.windwBox, this.windwBoxBtn);
    },
    goHome() {
      this.$router.push("/");
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/web/login",
          this.loginForm
        );
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error("登录失败");
        } else {
          this.$message.success("登录成功");
          window.sessionStorage.setItem("token", res.data.token);

          //页面跳转
          await this.$router.push("/home");
          // this.$store.commit('setNavDarkActive', {
          //   navDarkActive: false
          // })
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
::v-deep .el-input-group__append {
  background-color: white !important;
}
.login {
  //min-height: 800px;
  position: relative;
  height: 100%;
  background: url("~@/assets/images/login_bg.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

.login_header {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  //border-bottom: 1px solid #f8f8f8;
}

.box {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: table;
  -webkit-box-align: center;
  -ms-flex-align: center;
  position: relative;
  display: flex;
  align-items: center;
}

.background-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  z-index: -1;
}
.container {
}
.container-login {
  min-width: 480px;
  padding: 0 35px 35px;
  background: #fff;
  backdrop-filter: blur(5px);
  border: none;
  position: absolute;
  right: 135px;
  /* bottom: calc(50% - 310px); */
  vertical-align: middle;
  display: table-cell;

  .goHome {
    font-size: 16px;
    /* color: #FFFFFF; */
    position: absolute;
    right: 10px;
    top: 0;
  }
  .headerToggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
  }

  ::v-deep .el-form-item__content {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;

    .el-button {
      //margin-right: 80px;
    }

    .el-input__inner {
      background-color: rgba(255, 255, 255, 0.5);
      border: none;
    }

    input::placeholder {
      color: #818181;
    }
  }

  .pull-right {
    position: relative;
    .pull-btn-left {
      font-size: 13px;
      position: absolute;
      left: 1px;
      color: rgba(111, 111, 111, 1);
    }
    .pull-btn-right {
      font-size: 13px;
      position: absolute;
      right: 1px;
      color: rgba(111, 111, 111, 1);
    }
  }
  .el-button.is-round {
    border-radius: 1px;
    width: 100%;
  }
  .btn-color {
    background-color: #005195;
  }
}
</style>
