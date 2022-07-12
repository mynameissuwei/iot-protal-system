<template>
  <el-container style="height: 100%">
    <el-header>
      <Header />
    </el-header>
    <el-container :style="'height: calc(100% - 60px)'">
      <el-aside width="200px">
        <Navigation />
      </el-aside>
      <el-main class="main-content">
        <!-- 面包屑 -->
        <Breadcrumb />
        <div class="container">
          <!-- <el-container> -->
          <router-view></router-view>
          <!-- </el-container> -->
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Header from "./header.vue";
import Navigation from "./navigation.vue";
import Breadcrumb from "./breadcrumb.vue";
</script>

<style scoped lang="less">
.el-header {
  background: #264480;
  color: #fff;
  height: 48px;
  padding: 0 16px;
}

.el-main {
  background-color: #f4f5f9;
  padding: 0;
  .container {
    padding: 20px;
  }
}
</style>
