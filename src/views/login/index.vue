<template>
  <div class="login">
    <div class="box">
      <el-card class="container-login" ref="loginCard">
        <el-button class="go-home" text @click="goHome">返回首页</el-button>
        <div class="headerToggle">
          <h2>欢迎使用恩牛网物联平台</h2>
        </div>
        <el-tabs v-model="activeName" v-if="+windowBoxBtn === 1">
          <el-tab-pane
            :label="authText"
            name="zero"
            class="class-filter"
            v-if="isAuth ? +defaultLogin === 0 : false"
          >
            <el-form
              ref="loginFormLDAPRef"
              :rules="loginFormRules"
              :model="loginFormLDAP"
              label-width="0"
            >
              <el-form-item prop="account" key="account">
                <el-input
                  placeholder="请输入账号"
                  v-model.psw.trim="loginFormLDAP.account"
                  :suffix-icon="User"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password" key="password">
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  v-model.psw.trim="loginFormLDAP.password"
                  :suffix-icon="Lock"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="btn-color btn-height"
                  type="primary"
                  round
                  @click="
                    loginTo(GrantType.LDAP, loginFormLDAPRef, loginFormLDAP)
                  "
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="密码登录" name="first" class="class-filter">
            <el-form
              ref="loginFormRef"
              :rules="loginFormRules"
              :model="loginForm"
              label-width="0"
            >
              <el-form-item prop="account" key="account">
                <el-input
                  placeholder="请输入账号"
                  v-model.psw.trim="loginForm.account"
                  :suffix-icon="User"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password" key="password">
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  v-model.psw.trim="loginForm.password"
                  :suffix-icon="Lock"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="btn-color btn-height"
                  type="primary"
                  round
                  @click="loginTo(GrantType.PASSWORD, loginFormRef, loginForm)"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="second">
            <el-form
              ref="loginFormSMSCaptchaRef"
              :model="loginFormSMSCaptcha"
              :rules="loginFormSMSCaptchaRules"
              label-width="0"
            >
              <el-form-item prop="mobile" key="mobile">
                <el-input
                  maxlength="11"
                  placeholder="请输入手机号"
                  v-model="loginFormSMSCaptcha.mobile"
                  :suffix-icon="User"
                ></el-input>
              </el-form-item>
              <el-form-item prop="smsCaptcha" key="smsCaptcha">
                <el-row>
                  <el-col :span="17">
                    <el-input
                      placeholder="请输入短信验证码"
                      v-model="loginFormSMSCaptcha.smsCaptcha"
                    >
                    </el-input>
                  </el-col>
                  <el-col :span="6" style="margin-left: 16px">
                    <el-button
                      class="btn-height"
                      :disabled="isDisabled"
                      @click="
                        getSmsCaptcha(loginFormSMSCaptcha.mobile, 'login')
                      "
                      >{{ buttonName }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="btn-color btn-height"
                  type="primary"
                  round
                  @click="
                    loginTo(
                      GrantType.SMS_CAPTCHA,
                      loginFormSMSCaptchaRef,
                      loginFormSMSCaptcha
                    )
                  "
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            :label="authText"
            name="zero"
            class="class-filter"
            v-if="isAuth ? +defaultLogin === 1 : false"
          >
            <el-form
              ref="loginFormLDAPRef"
              :rules="loginFormRules"
              :model="loginFormLDAP"
              label-width="0"
            >
              <el-form-item prop="account" key="account">
                <el-input
                  placeholder="请输入账号"
                  v-model.psw.trim="loginFormLDAP.account"
                  :suffix-icon="User"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password" key="password">
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  v-model.psw.trim="loginFormLDAP.password"
                  :suffix-icon="Lock"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="btn-color btn-height"
                  type="primary"
                  round
                  @click="
                    loginTo(GrantType.LDAP, loginFormLDAPRef, loginFormLDAP)
                  "
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div v-if="+windowBoxBtn === 2">
          <el-form
            ref="selectTenantFormRef"
            :rule="selectTenantFormRules"
            :model="selectTenantForm"
            label-width="0"
          >
            <el-form-item prop="tenantId" key="tenantId">
              <el-select
                v-model="selectTenantForm.tenantId"
                placeholder="请选择租户"
                style="width: 100%"
                @change="changeTenantId"
              >
                <el-option
                  v-for="item in options.tenantList"
                  :key="item.tenantId"
                  :label="item.tenantName"
                  :value="item.tenantId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :span="24">
                  <el-button
                    class="btn-color btn-height btn-mb"
                    type="primary"
                    :disabled="selectTenantForm.tenantId === ''"
                    round
                    @click="
                      loginTo(GrantType.SWITCH_TENANT, selectTenantFormRef, {
                        ...selectTenantForm,
                        token,
                      })
                    "
                    >登录</el-button
                  >
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-button
                    class="btn-height"
                    round
                    @click="switchWindowBox(1)"
                    >更换账号</el-button
                  >
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
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
import { getLoginToken, getLoginSmsCaptcha, ldapCheck } from "@/api";
import { phonePattern } from "@/utils/pattern";
import { GrantType } from "@/types";

const router = useRouter();
const route = useRoute();

const redirectURL = ref(route.query.redirect ?? "/");

const loginFormRef = ref<FormInstance>();
const loginFormLDAPRef = ref<FormInstance>();
const loginFormSMSCaptchaRef = ref<FormInstance>();
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

onBeforeMount(() => {
  initData();
});

const initData = () => {
  getCookie(); //判断cookie中的值
  ldapCheck().then((res) => {
    console.log(res, "LDAP已请求");
    const { moduleName, defaultLogin } = res;
    isAuth.value = true;
    authText.value = moduleName;
    defaultLogin.value = Number(defaultLogin);
    if (+defaultLogin.value === 0) {
      activeName.value = "zero";
    }
  });
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
  if (window.location.search.indexOf("redirect") == -1) {
    router.push({
      path: "/",
    });
  } else {
    window.open(
      `${redirectURL.value}?bladeAuth=${localStorage.getItem(
        "bladeAuth"
      )}&tenantId=${localStorage.getItem(
        "tenantId"
      )}&authCode=${localStorage.getItem("authCode")}`,
      "_self"
    );
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
    if (grantType === GrantType.SWITCH_TENANT) {
      localStorage.setItem("authCode", res?.authInfo?.loginCode);
    }
    const { accessToken, tenantList } = res;
    if (accessToken) {
      options.tenantList = tenantList ?? [];
      token.value = accessToken;
      localStorage.setItem("bladeAuth", accessToken);
      localStorage.setItem("tenantId", res.tenantId);
      localStorage.setItem("iotToken", res["iot-token"]);
      localStorage.setItem("itcode", res.itcode);
      if (tenantList?.length > 1 && grantType !== GrantType.SWITCH_TENANT) {
        switchWindowBox(2);
      } else {
        redirectFn();
      }
    }
  });
};

const switchWindowBox = (num: number) => {
  windowBoxBtn.value = num;
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
