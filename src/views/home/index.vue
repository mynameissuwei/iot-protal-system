<template>
  <div>hello，world！</div>
  <!-- <el-button @click="importUser" type="primary">导入用户</el-button> -->
  <el-button @click="exportTemplateCSV" type="primary">导入模板 下载</el-button>
  <el-button @click="exportErrorCSV" type="primary">导出错误数据</el-button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElButton } from "@enn/ency-design";
import { importUser, exportTemplate, exportError } from "@/api";

onMounted(() => {
  console.log(111);
});

// const importUser = () => {
//   const params = { a: 1 };
//   importUser(params).then((data) => {
//     console.log(data);
//   });
// };

const exportTemplateCSV = () => {
  exportTemplate().then((data) => {
    console.log(data);
  });
};

const exportErrorCSV = () => {
  const params = { id: 1 };
  exportError(params).then((data) => {
    console.log(data);
  });
};
</script>
