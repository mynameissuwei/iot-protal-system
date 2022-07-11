<template>
  <div class="nav-container">
    <el-menu :default-active="defaultKey">
      <template v-for="item in MenuData" :key="item.key">
        <el-sub-menu :index="item.key" v-if="item.subMenu">
          <template #title>
            <IconSvg :name="item.icon" class="menu-icon" v-if="item.icon" />
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="ite in item.subMenu"
            :key="ite.key"
            @click="skipTo(item)"
          >{{ ite.name }}</el-menu-item>
        </el-sub-menu>
        <el-menu-item :index="item.key" @click="skipTo(item)" v-else>
          <IconSvg :name="item.icon" class="menu-icon" v-if="item.icon" />
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import MenuData from "./menu";
import { MenuInfo } from "@/types";

const route = useRoute();
const router = useRouter();
const defaultKey = ref(route.meta.key || "home");
const skipTo = (obj: MenuInfo) => {
  router.push(obj.url);
};
</script>

<style scoped lang="less">
.nav-container {
  .menu-icon {
    height: 18px;
    width: 18px;
    margin-right: 14px;
  }
  :deep(.el-menu-item.is-active) {
    color: rgba(0, 0, 0, 1);
    border-left: 2px solid rgba(4, 115, 255, 1);
    background: rgba(4, 115, 255, 0.04);
  }
  .el-menu {
    border: 0;
  }
}
</style>
