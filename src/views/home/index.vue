<template>
  <div>hello，world！</div>
  <el-button @click="importUserData" type="primary">导入用户</el-button>
  <el-link :href="exportTemplateURL" type="info">下载用户模板</el-link>
  <el-link :href="exportErrorCSVURL" type="info">下载错误数据</el-link>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElButton } from "@enn/ency-design";
import { importUser } from "@/api";
import { API_ENN_USER } from "@/const";

const exportTemplateURL = `${API_ENN_USER}/user/export-template?blade-auth=${localStorage.getItem(
  "blade-auth"
)}`;
const exportErrorCSVURL = ref("");

onMounted(() => {
  console.log(111);
});

const importUserData = () => {
  const id = 1657706588112;
  exportErrorCSVURL.value = `${API_ENN_USER}/user/export-error/${id}?blade-auth=${localStorage.getItem(
    "blade-auth"
  )}`;
  const params = { a: 1 };
  importUser(params).then((data) => {
    console.log(data);
  });
};
</script>
