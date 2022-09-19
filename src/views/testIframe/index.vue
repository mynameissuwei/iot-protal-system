<template>
  <div class="login">
    <div class="box">
      <el-card class="container-login" ref="loginCard">
        <el-button class="go-home" text @click="goHome">返回首页</el-button>
        <div class="headerToggle">
          <h2>我是测试页面</h2>
        </div>
        <el-form
          ref="selectTenantFormRef"
          :rule="selectTenantFormRules"
          :model="selectTenantForm"
          label-width="0"
        >
          <el-form-item>
            <el-row>
              <el-col :span="24">
                <el-button
                  type="primary"
                  class="btn-height btn-mb"
                  round
                  @click="switchWindowBox(urlData[0].shareLink, 'share')"
                  :disabled="urlData[0].shareLink === ''"
                  >跳转图模分享页面</el-button
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-button
                  class="btn-height"
                  round
                  @click="switchWindowBox(urlData[0].editLink, 'edit')"
                  :disabled="urlData[0].editLink === ''"
                  >跳转图模编辑页面</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ElButtonToggle,
  ElMsgToast,
  FormInstance,
  tokenEmits,
} from "@enn/ency-design";
import { Lock, User } from "@enn/ency-design-icons";
import { getLoginToken, getLoginSmsCaptcha, getTopoPic } from "@/api";
import { phonePattern } from "@/utils/pattern";
import { GrantType } from "@/types";

const router = useRouter();
const route = useRoute();

const redirectURL = ref(route.query.redirect ?? "/");
const selectTenantFormRef = ref<FormInstance>();

// 登录表单
const loginForm = reactive({
  account: "",
  password: "",
});

const loginFormLDAP = reactive({
  account: "",
  password: "",
});

const loginFormSMSCaptcha = reactive({
  mobile: "",
  smsCaptcha: "",
});

const selectTenantForm = reactive({
  tenantId: "",
});

const options = reactive({ tenantList: [] });

// 表单验证规则
const loginFormRules = {
  account: [
    {
      required: true,
      message: "请输入账号",
      trigger: "change",
    },
  ],
  // 验证密码是否合法
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
};
const loginFormSMSCaptchaRules = {
  // mobile: [{  required: true, message: "请输入短信验证码",trigger: "blur" }],
  mobile: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "change",
    },
    {
      pattern: phonePattern,
      message: "请输入正确的手机号",
      trigger: "change",
    },
  ],
  smsCaptcha: [
    {
      required: true,
      message: "请输入短信验证码",
      trigger: "change",
    },
  ],
};

// const validatePass = (rule: any, value: any, callback: any) => {
//   debugger;
//   if (value === "") {
//     callback(new Error("请输入密码"));
//   } else {
//     callback();
//   }
// };
const selectTenantFormRules = reactive({
  // tenantId: [{ validator: validatePass, trigger: "change" }],
  tenantId: [
    {
      required: true,
      message: "请选择租户",
      trigger: "change",
    },
  ],
});

const isAuth = ref(false);
const authText = ref("LDAP");
const defaultLogin = ref(1);
const activeName = ref("first");
// 短信验证码
const countDown = ref(60); //倒计时
const buttonName = ref("获取验证码");
const isDisabled = ref(false); //是否禁用按钮
const isRemember = ref(false);
const windowBoxBtn = ref(1);
const token = ref("");
// console.log("countDown", countDown.value);
let urlData = reactive([
  {
    id: 12004,
    name: "test",
    shareLink: "",
    editLink: "",
  },
]);

onBeforeMount(() => {
  initData();
});

const initData = () => {
  getTopoPic().then((res) => {
    console.log(res);
    urlData[0].shareLink = res[0].shareLink;
    urlData[0].editLink = res[0].editLink;

    // urlData[0].shareLink =
    //   "https://air.dev.ennew.com/graph-platform/editor/#/viewer?projectId=3921&paperId=12004&editorMode=function-energy-topology";

    // urlData[0].editLink =
    //   "https://air.dev.ennew.com/graph-platform/editor/#/editor?projectId=3921&paperId=12004&editorMode=function-energy-topology";
  });

  getCookie(); //判断cookie中的值
  //从sessionStorage中读取倒计时
  if (sessionStorage.getItem("CountDownInfo")) {
    countDown.value = JSON.parse(
      sessionStorage.getItem("CountDownInfo") ?? ""
    ).countDown;
    isDisabled.value = JSON.parse(
      sessionStorage.getItem("CountDownInfo") ?? ""
    ).isDisabled;
  }
  //进入该页面时，若倒计时还在进行，则继续倒计时
  if (isDisabled.value === true) {
    timeCountDown();
  }
  //在页面刷新时将vuex里的信息保存到localStorage里
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem(
      "CountDownInfo",
      JSON.stringify({
        countDown: countDown.value,
        isDisabled: isDisabled.value,
      })
    );
  });
};

const timeCountDown = () => {
  let timerId = setInterval(() => {
    countDown.value--;
    buttonName.value = countDown.value + "秒后重试";
    if (countDown.value <= 0) {
      clearInterval(timerId);
      buttonName.value = "重新发送";
      countDown.value = 60;
      isDisabled.value = false;
    }
  }, 1000);
};

// 登录&注册获取短信验证码
const getSmsCaptcha = async (mobile: any, type: any) => {
  if (type === "login") {
    // 登录验证码接口
    getLoginSmsCaptcha(mobile).then(() => {
      //按钮禁止，并进行倒计时，防止网速慢的用户重复点击
      isDisabled.value = true;
      timeCountDown();
    });
  }
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
        loginForm.account = userKey[1];
      } else if (userKey[0].trim() == "userPws") {
        loginForm.password = userKey[1];
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

const loginTo = async (
  grantType: GrantType,
  formEl: FormInstance | undefined,
  formModel: any
) => {
  console.log(formModel);
  if (!formEl) return;
  formEl.validate(async (valid: any) => {
    if (!valid) return;
    const params = { ...formModel, grantType };
    console.log(params);
    const res = await getLoginToken(params);
    const { accessToken, tenantList } = res;
    if (accessToken) {
      options.tenantList = tenantList ?? [];
      // $message.success(`账号 ${loginForm1.account} 登录成功！`);
      token.value = accessToken;
      localStorage.setItem("bladeAuthNew1", accessToken);
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
    }
  });
};

const switchWindowBox = (url: string, type: string) => {
  const finURL =
    type === "share"
      ? url
      : `${url}&authCode=${localStorage.getItem(
          "authCode"
        )}&authTenantId=${localStorage.getItem("tenantId")}`;
  console.log(finURL);
  window.open(url);
};

const changeTenantId = async (tenantId: string) => {
  selectTenantForm.tenantId = tenantId;
  // const params = { tenantId };
  // const result = await API.getLoginToken(params);
  // if (result) {
  //   apiUserInfos.tenantId = tenantId;
  //   redirectFn();
  // }
};
</script>

https://air.dev.ennew.com/graph-platform/editor/#/editor?projectId=3921&paperId=12004&editorMode=function-energy-topology&authCode=null&authTenantId=1570761180500131842

<style scoped lang="scss">
// :deep(.el-input-group__append) {
//   background-color: white !important;
// }
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
  min-width: 550px;
  padding: 10px 35px 25px;
  background: #fff;
  backdrop-filter: blur(5px);
  border: none;
  position: absolute;
  right: 135px;
  /* bottom: calc(50% - 310px); */
  vertical-align: middle;
  display: table-cell;

  .go-home {
    font-size: 16px;
    /* color: #FFFFFF; */
    position: absolute;
    right: 5px;
    top: 20px;
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
    display: block;
    // justify-content: space-between;
    margin: 0 auto;
    .el-input__inner {
      height: 40px;
      background-color: rgba(255, 255, 255, 0.5);
      // border: none;
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
  .btn-height {
    height: 40px;
  }
  .btn-mb {
    margin-bottom: 18px;
  }
}
</style>
