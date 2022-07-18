<template>
  <el-dialog
    :title="upLoading ? '导入进行中' : '导入'"
    v-model="props.importVisible"
    width="40%"
  >
    <div v-loading="upLoading" element-loading-text="导入中">
      <el-row style="margin: 20px">
        <el-col :span="4">导入文件：</el-col>
        <el-col :span="20">
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
            <el-link
              :href="exportTemplateURL"
              type="info"
              style="margin-left: 20px"
              >下载模板</el-link
            >
          </el-upload>
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
        <el-button @click="props.handleHidden">取消</el-button>
      </div>
    </div>
  </el-dialog>

  <el-dialog
    :title="isSuccess ? '导入成功' : '导入失败'"
    v-model="resultVisible"
    width="40%"
  >
    <div>{{ msg }}</div>
    <div style="text-align: right">
      <el-button v-if="isSuccess" type="primary" @click="resultVisible = false"
        >关闭</el-button
      >
      <el-button v-if="!isSuccess" @click="resultVisible = false">
        <el-link :href="exportErrorCSVURL" type="info" style="margin-left: 20px"
          >关闭并下载错误文件</el-link
        ></el-button
      >
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, unref } from "vue";
import { ElButton, ElMsgBox, ElMsgToast, ElBusyState } from "@enn/ency-design";
import { importUser } from "@/api";
import { API_ENN_USER } from "@/const";

const exportTemplateURL = `${API_ENN_USER}/user/export-template?blade-auth=${localStorage.getItem(
  "blade-auth"
)}`;

const id = ref("");
const exportErrorCSVURL = computed(() => {
  return `${API_ENN_USER}/user/export-error/${unref(
    id
  )}?blade-auth=${localStorage.getItem("blade-auth")}`;
});

const upload = ref();
const fileList = ref([]);
const upLoading = ref(false);
const msg = ref("");
const resultVisible = ref(false);
const isSuccess = ref(false);

const props = defineProps(["importVisible", "handleHidden"]);

const handleExceed = () => {
  ElMsgToast({ message: "只能选择一个文件", type: "warning" });
};

//  覆盖默认上传行为
const httpRequest = (params: any) => {
  const fd = new FormData();
  fd.append("file", params.file);
  importUser(fd)
    .then((data) => {
      const { errorId, errorCount, totalCount } = data;
      if (errorCount != 0) {
        resultVisible.value = true;
        isSuccess.value = false;
        props.handleHidden();
        msg.value = `本次共解析${totalCount}条数据，其中${errorCount}条解析失败，导入${
          totalCount - errorCount
        }条。`;
      } else {
        resultVisible.value = true;
        isSuccess.value = true;
        id.value = errorId;
        props.handleHidden();
        msg.value = `本次共解析${totalCount}条数据，导入成功${totalCount}条数据`;
      }
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
  upLoading.value = true;
  upload.value.submit();
  setTimeout(() => {
    upLoading.value = false;
  }, 1200);
};
</script>
