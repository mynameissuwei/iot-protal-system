<template>
  <el-row style="margin: 20px">
    <el-col :span="4">导入文件：</el-col>
    <el-col :span="20">
      <!-- <el-button @click="importUserData" type="primary">导入用户</el-button> -->
      <el-upload
        style="display: inline-block"
        ref="upload"
        action="string"
        accept=".xls, .xlsx"
        :limit="1"
        :on-exceed="handleExceed"
        :http-request="httpRequest"
        :auto-upload="false"
        :before-upload="beforeExcelUpload"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :file-list="fileList"
      >
        <el-button :icon="Export">选择文件</el-button>
      </el-upload>
      <el-link :href="exportTemplateURL" type="info" style="margin-left: 20px"
        >下载用户模板</el-link
      >
      <!-- <el-link :href="exportErrorCSVURL" type="info">下载错误数据</el-link> -->
    </el-col>
  </el-row>

  <el-row style="margin: 20px; margin-top: 20px">
    <el-col :span="4">导入说明：</el-col>
    <el-col :span="20">
      <div>1、单次最大导入数据为 1000 条，若数据过多，请分批导入。</div>
      <div>2、仅支持导入 csv 格式的文件。</div>
      <div>3、如有重复数据，以最后一条为准。</div></el-col
    >
  </el-row>

  <div style="text-align: right">
    <el-button
      :disabled="fileList.length === 0"
      type="primary"
      @click="onDialogConfirmImport()"
      >确认</el-button
    >
    <el-button @click="onDialogConfirmImport()">取消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElButton } from "@enn/ency-design";
import { importUser, exportTemplate, exportError } from "@/api";

const a = { testset: 232323 };

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
