<template>
  <div class="auth">
    <div class="auth-step">
      <el-steps :active="active" finish-status="success" class="auth-steps">
        <el-step title="选择认证类型"></el-step>
        <el-step title="配置认证信息"></el-step>
        <el-step title="调试"></el-step>
      </el-steps>
    </div>
    <el-form
      ref="dataForm"
      :model="formData"
      :rules="formRules"
      label-position="right"
      label-width="180px"
      class="auth-form"
    >
      <div v-show="active == 1">
        <el-form-item label="请选择认证身份源类型" prop="authType">
          <el-select
            v-model="formData.authType"
            placeholder="请选择认证身份源类型"
          >
            <el-option label="LDAP" value="LDAP" />
          </el-select>
        </el-form-item>
      </div>
      <div v-show="active == 2">
        <el-form-item label="LDAP服务器地址" prop="address">
          <el-input
            v-model="formData.address"
            placeholder="请输入LDAP服务器地址和端口号"
          />
        </el-form-item>
        <el-form-item label="授权方式" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">匿名</el-radio>
            <el-radio :label="2">使用Bind DN</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="UID" prop="uid">
          <el-input
            v-model="formData.uid"
            placeholder="请输入LDAP用户名的主键名"
          />
        </el-form-item>
        <el-form-item label="Bind DN" prop="bindDN">
          <el-input
            v-model="formData.bindDN"
            placeholder="请输入访问LDAP服务器的用户名"
          />
        </el-form-item>
        <el-form-item label="Bind DN密码" prop="bindDNPassWord">
          <el-input
            v-model="formData.bindDNPassWord"
            placeholder="请输入访问LDAP服务器的密码"
          />
        </el-form-item>
        <el-form-item label="Base DN" prop="baseDN">
          <el-input
            v-model="formData.baseDN"
            placeholder="定义从哪个目录开始检索的配置"
          />
        </el-form-item>
        <el-form-item label="登录模块名称" prop="moduleName">
          <el-input
            v-model="formData.moduleName"
            placeholder="登录页面展示的名称"
          />
        </el-form-item>
        <el-form-item label="默认登录方式" prop="defaultLogin">
          <el-radio-group v-model="formData.defaultLogin">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-show="active == 3">
        <el-form-item label="账户名" prop="testAccount">
          <el-input
            v-model="formData.testAccount"
            placeholder="请输入测试账号"
          />
        </el-form-item>
        <el-form-item label="密码" prop="testPassWord">
          <el-input
            v-model="formData.testPassWord"
            placeholder="请输入测试密码"
          />
        </el-form-item>
      </div>
      <p class="auth-btn">
        <el-button style="margin-top: 12px" @click="last" v-show="active != 1"
          >上一步</el-button
        >
        <el-button style="margin-top: 12px" @click="next" v-show="active != 3"
          >下一步</el-button
        >
        <el-button
          style="margin-top: 12px"
          @click="finish(formData)"
          v-show="active == 3"
          >完成</el-button
        >
      </p>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, markRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import { addAuth, editAuth, getAuth } from "@/api/idAuth";
import {
  ElHeaderActionBar,
  HeaderActionButtonGroupItem,
  ElMsgBox,
  ElMsgToast,
  ElPagination,
  ElInput,
} from "@enn/ency-design";

const router = useRouter();
const route = useRoute();

const active = ref(1);
const formData = reactive({
  authType: "LDAP",
  address: "",
  type: "",
  uid: "",
  bindDN: "",
  bindDNPassWord: "",
  baseDN: "",
  moduleName: "",
  defaultLogin: "",
  testAccount: "",
  testPassWord: "",
});

const formRules = reactive({
  address: [
    { required: true, message: "服务器地址不能为空", trigger: "change" },
    { min: 1, max: 200, message: "请输入1到200位字符", trigger: "change" },
  ],
  baseDN: [
    { required: true, message: "baseDN不能为空", trigger: "change" },
    { min: 1, max: 200, message: "请输入1到200位字符", trigger: "change" },
  ],
});
const next = () => {
  if (active.value++ > 2) active.value = 1;
};
const last = () => {
  if (active.value-- < 1) active.value = 1;
};

// 新增/编辑保存
const finish = (formData: { moduleName: any }) => {
  const fomeDataNew = JSON.stringify(formData);
  const isEdit = route.query.status === "isEdit";
  (isEdit ? editAuth(fomeDataNew) : addAuth(fomeDataNew)).then((res) => {
    ElMsgToast({
      type: "success",
      message: `${formData.moduleName} 身份源创建成功~`,
    });
    router.push({
      path: "/stepComplete",
    });
  });
};

onMounted(() => {
  if (route.query.status === "isEdit") {
    getAuth().then((res) => {
      console.log(res, "resss");
      Object.assign(formData, res);
    });
  }
});
</script>

<style lang="less" scoped>
.auth {
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 26px;
  padding-top: 80px;
  position: relative;
  .auth-step {
    display: flex;
    justify-content: center;
    .auth-steps {
      width: 600px;
    }
  }

  .auth-form {
    display: flex;
    justify-content: center;
    margin-top: 52px;

    // width: 400px;
    div {
      width: 400px;
    }
  }
  .auth-btn {
    text-align: center;
    position: absolute;
    top: 550px;
    left: 50%;
  }
}
</style>
