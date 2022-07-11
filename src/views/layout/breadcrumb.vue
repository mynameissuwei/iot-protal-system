<template>
  <div class="custom-breadcrumb">
    <el-breadcrumb separator="/">
      <!-- <el-breadcrumb-item>{{ route.meta.upLevel }}</el-breadcrumb-item> -->
      <template v-if="route.meta && route.meta.bread && route.meta.bread.length">
        <template v-for="item in route.meta.bread" :key="`${item.title}${item.name}`">
          <el-breadcrumb-item>
            <span @click.prevent="jumpPage(item)" style="cursor: pointer">{{ item.title }}</span>
          </el-breadcrumb-item>
        </template>
      </template>
      <template v-else>
        <el-breadcrumb-item>
          <span @click="toAppointPage">{{ route.meta && route.meta.title }}</span>
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
console.log('route',route)
const jumpPage = (item: any) => {
  if (!item.title) {
    router.go(-1);
  } else {
    router.push({
      name: item.name,
    });
  }
};
const toAppointPage = () => {
  console.log(route);
};
const handleReturn = () => {
  router.go(-1);
};
</script>
<style scoped lang="less">
.custom-breadcrumb {
  background: #fff;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  :deep(.el-breadcrumb__inner) {
    color: #999;
  }
  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: #666;
  }
  :deep(.return) {
    font-size: 13px;
    width: 50px;
    cursor: pointer;
    svg {
      width: 15px;
      height: 15px;
      padding-top: 5px;
    }
  }
}
</style>
