<template>
  <div class="header-container">
    <div class="header-lf">
      <el-image
        :src="require('@/assets/images/logo.png')"
        alt="LOGO"
        style="width: 50px; height: 20px"
      />
      <p></p>
      <span>项目名称</span>
    </div>
    <div class="header-rg">
      <el-image
        :src="require('@/assets/images/avatar.png')"
        alt="User"
        style="width: 36px; height: 36px"
      />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.nickname || '用户名称' }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, inject } from "vue";
import { ArrowDown } from "@enn/ency-design-icons";

const userInfo = inject("userInfo") || {};
console.log(userInfo, "userInfo");
const logout = () => {
  const { vue } = window as any;
  vue.config.globalProperties.authSdk.logout();
};

</script>
<style scoped lang="less">
.header-container {
  display: flex;
  align-content: center;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
  .header-lf,
  .header-rg {
    display: flex;
    align-items: center;
    height: 48px;
    line-height: 48px;
    .el-dropdown-link {
      display: flex;
      align-items: center;
      color: #fff;
    }
  }
  .header-lf {
    p {
      width: 1px;
      height: 14px;
      margin: 0 16px;
      background: rgba(255, 255, 255, 0.4);
    }

    span:last-child {
      font-size: 16px;
    }
  }
}
</style>
