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
import { ElButton, ElMsgBox, ElMsgToast } from "@enn/ency-design";
import { importUser } from "@/api";
import { API_ENN_USER } from "@/const";

const exportTemplateURL = `${API_ENN_USER}/user/export-template?blade-auth=${localStorage.getItem(
  "blade-auth"
)}`;
const exportErrorCSVURL = ref("");
const upload = ref();
const fileList = ref([]);

// const emit = defineEmits(["cancelDialog", "updateTable"]);

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

const handleExceed = () => {
  ElMsgToast({ message: "只能选择一个文件", type: "warning" });
};

//  覆盖默认上传行为
const httpRequest = (params: any) => {
  const fd = new FormData();
  fd.append("file", params.file);
  importUser(fd)
    .then((data) => {
      if (Object.keys(data).length > 0) {
        const { dataInvalid, dataUnique = [], msg } = data;
        // 数据无效
        if (dataInvalid) {
          if (dataUnique.length > 0) {
            ElMsgBox({
              title: "导入失败",
              type: "error",
              message: `${msg}:${dataUnique.join("；")}`,
              confirmButtonText: "关闭",
              showCancelButton: false,
            });
          } else {
            ElMsgBox({
              title: "导入失败",
              type: "error",
              message: msg,
              confirmButtonText: "关闭",
              showCancelButton: false,
            });
          }
        } else {
          ElMsgToast.success("导入成功");
          // emit("updateTable");
        }
      } else {
        ElMsgToast.success("导入成功");
        // emit("updateTable");
      }
      // emit("cancelDialog");
    })
    .catch((e) => console.warn(e));
};

const beforeExcelUpload = (file: any) => {
  const isExcel =
    file.name.split(".")[1] === "xlsx" || file.name.split(".")[1] === "xls";
  const isSize = file.size / 1024 / 1024 < 10;
  if (!isExcel) {
    ElMsgToast.warning("只能上传xls或xlsx文件!");
  }
  if (!isSize) {
    ElMsgToast.warning("上传文件大小不能超过 10MB!");
  }
  return isExcel && isSize;
};

const handleChange = (file: any, fileListVal: any) => {
  fileList.value = fileListVal;
};

const handleRemove = () => {
  fileList.value = [];
};
const onDialogConfirmImport = () => {
  upload.value.submit();
};
</script>
