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
        <el-tabs v-model="activeName" v-if="+windwBoxBtn === 1">
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
                  <!-- <el-button
                    slot="append"
                    type="primary"
                    plain
                    @click="getRegisterCode(codeLoginForm.mobile, 'login')"
                    :disabled="isDisabled"
                    >{{ buttonName }}</el-button
                  > -->
                  <el-button
                    type="primary"
                    plain
                    @click="getRegisterCode(codeLoginForm.mobile, 'login')"
                    :disabled="isDisabled"
                    >{{ buttonName }}</el-button
                  >
                </el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button
                  class="btn-color"
                  type="primary"
                  round
                  @click="loginTo"
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
            <span v-if="+windwBoxBtn === 2" @click="toLogin()">立即登录</span>
          </el-button>
        </div>
      </el-card>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLoginToken, getLoginSmsCaptcha, ldapCheck } from "@/api";
import { ref, onBeforeMount, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const redirectURL = ref(route.query.redirect ?? "/");

// 登录表单
const loginForm1 = reactive({
  account: "",
  password: "",
});

const codeLoginForm = reactive({
  mobile: "",
  smsCaptcha: "",
});

// 表单验证规则
const codeLoginFormRules = {
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
};
const LoginFormRulesP = {
  account: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
  ],
  // 验证密码是否合法
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
};

const isAuth = ref(false);
const authText = ref("LDAP");
const defaultLogin = ref("1");
const activeName = ref("first");
// 短信验证码
const CountDown = ref(60); //倒计时
const buttonName = ref("获取验证码");
const isDisabled = ref(false); //是否禁用按钮
const isRemember = ref(false);
const windwBox = ref("1");
const windwBoxBtn = ref(1);
const loginFormRefA = ref();

const initData = () => {
  getCookie(); //判断cookie中的值
  ldapCheck().then((res) => {
    console.log(res, "LDAP已请求");
    const { code, data } = res;
    isAuth.value = code == 200 ? true : false;
    authText.value = data.moduleName;
    defaultLogin.value = data.defaultLogin;
    if (isAuth.value) {
      if (defaultLogin.value == "0") {
        activeName.value = "zero";
      }
    }
  });
  //从sessionStorage中读取倒计时
  if (sessionStorage.getItem("CountDownInfo")) {
    CountDown.value = JSON.parse(
      sessionStorage.getItem("CountDownInfo") ?? ""
    ).CountDown;
    isDisabled.value = JSON.parse(
      sessionStorage.getItem("CountDownInfo") ?? ""
    ).isDisabled;
  }
  //进入该页面时，若倒计时还在进行，则继续倒计时
  if (isDisabled.value) {
    let timerId = setInterval(() => {
      CountDown.value--;
      buttonName.value = CountDown.value + "秒后重试";
      if (CountDown.value <= 0) {
        clearInterval(timerId);
        buttonName.value = "重新发送";
        CountDown.value = 60;
        isDisabled.value = false;
      }
    }, 1000);
  }
  //在页面刷新时将vuex里的信息保存到localStorage里
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem(
      "CountDownInfo",
      JSON.stringify({
        CountDown: CountDown,
        isDisabled: isDisabled,
      })
    );
  });
};

onBeforeMount(() => {
  initData();
});
// 登录&注册获取短信验证码
const getRegisterCode = async (mobile: any, type: any) => {
  if (mobile) {
    //按钮禁止，并进行倒计时，防止网速慢的用户重复点击
    isDisabled.value = true;
    let timerId = setInterval(() => {
      CountDown.value--;
      buttonName.value = CountDown.value + "秒后重试";
      if (CountDown.value <= 0) {
        clearInterval(timerId);
        buttonName.value = "重新发送";
        CountDown.value = 60;
        isDisabled.value = false;
      }
    }, 1000);
    if (type) {
      // 登录验证码接口
      const res = await getLoginSmsCaptcha(mobile);
      console.log(res);
    }
  } else {
    // $message.warning("请填写接收短信验证码的手机号");
  }

  // mobileCode = res.image;
};
const toLogin = () => {
  windwBox.value = "1";
  windwBoxBtn.value = 1;
  console.log(windwBox, windwBoxBtn);
};
const goHome = () => {
  router.push({
    path: "/",
  });
};
// 记住密码
const getCookie = () => {
  if (document.cookie.length > 0) {
    var arr = document.cookie.split(";");
    for (var i = 0; i < arr.length; i++) {
      var userKey = arr[i].split("=");
      if (userKey[0].trim() == "userName") {
        loginForm1.account = userKey[1];
      } else if (userKey[0].trim() == "userPws") {
        loginForm1.password = userKey[1];
      } else if (userKey[0].trim() == "isRemember") {
        isRemember.value = Boolean(userKey[1]);
      }
    }
  }
};
// 控制台登录地址重定向
const redirectFn = () => {
  console.log(window.location.search);
  let gdUrl = "https://feedback-workorder-web.dev.ennew.com/order-pool";
  let zcUrl = "https://data-asset-front.dev.ennew.com";
  let gdTenantId = "1369559970221985794";
  let zcTenantId = "1374980461627899905";
  let loginCode, authCode, userId, assetloginCode, assetAuthCode, assetUserId;
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
    router.push({
      path: "/",
    });
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
      let href = `${redirectURL.value}?bladeAuth=${bladeAuthVal}&tenantId=${tenantIdVal}&workorderUrl=${workorderUrl}&assetUrl=${assetUrl}&iotToken=${iotToken}&itcode=${itcode}`;
      window.open(href, "_self");
    } else {
      window.open(
        `${redirectURL.value}?bladeAuth=${bladeAuthVal}&tenantId=${tenantIdVal}`,
        "_self"
      );
    }
  }
};
const loginTo = async (isAuth: boolean) => {
  loginFormRefA.value.validate(async (valid: any) => {
    if (!valid) return;
    const result = isAuth ? { ...loginForm1, grantType: "ldap" } : loginForm1;
    const res = await getLoginToken(result);
    if (res.accessToken) {
      // $message.success(`账号 ${loginForm1.account} 登录成功！`);
      localStorage.setItem("bladeAuthNew1", res.accessToken);
      localStorage.setItem("tenantId1", res.tenantId);
      localStorage.setItem("userNameNew", res.account);
      localStorage.setItem("iotToken", res["iot-token"]);
      localStorage.setItem("itcode", res.itcode);
      if (Object.keys(res.platformAuthInfo).length > 0) {
        localStorage.setItem(
          "loginCode",
          res.platformAuthInfo && res.platformAuthInfo.loginCode
        );
        localStorage.setItem(
          "authCode",
          res.platformAuthInfo &&
            res.platformAuthInfo.ennUnifiedGrantCodeCookie &&
            res.platformAuthInfo.ennUnifiedGrantCodeCookie.value
        );
        localStorage.setItem(
          "userId",
          res.platformAuthInfo && res.platformAuthInfo.userId
        );
      }
      if (Object.keys(res.assetPlatformAuthInfo).length > 0) {
        localStorage.setItem(
          "assetloginCode",
          res.assetPlatformAuthInfo && res.assetPlatformAuthInfo.loginCode
        );
        localStorage.setItem(
          "assetAuthCode",
          res.assetPlatformAuthInfo &&
            res.assetPlatformAuthInfo.ennUnifiedGrantCodeCookie &&
            res.platformAuthInfo.ennUnifiedGrantCodeCookie.value
        );
        localStorage.setItem(
          "assetUserId",
          res.assetPlatformAuthInfo && res.assetPlatformAuthInfo.userId
        );
      }
      redirectFn();
    }
  });
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append) {
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

  :deep(.el-form-item__content) {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
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
