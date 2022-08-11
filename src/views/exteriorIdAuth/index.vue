<template>
  <div class="auth">
    <el-msg-page>
      <template #title>
        <el-text>配置连接企业的身份源认证</el-text>
      </template>
      <template #subTitle>
        <div class="decs">创建成功后用户即可使用企业账号登录恩牛物联平台</div>
      </template>
      <template #icon>
        <el-image style="height: 200px" :src="defaultSrc"></el-image>
      </template>
      <template #extra>
        <el-button type="primary" @click="toCreate">点击创建</el-button>
      </template>
    </el-msg-page>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { ElText, ElLink, ElButton, ElMsgPage } from "@enn/ency-design";
const router = useRouter();
const defaultSrc = ref(
  "https://authentication-center.dev.ennew.com/img/ennew.0304ed2b.png"
);

const toCreate = () => {
  console.log(111111);
  router.push({
    path: "/stepIdAuth",
  });
};
</script>
<style lang="less" scoped>
.auth {
  height: 100%;
  background: #fff;
}
</style>
