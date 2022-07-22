<template>
  <el-dialog
    :title="upLoading ? '导入进行中' : '导入'"
    v-model="props.importVisible"
    width="40%"
  >
    <div v-loading="upLoading" element-loading-text="导入中">
      <el-row style="margin: 20px">
        <el-col :span="4">导入文件：</el-col>
        <el-col :span="4">
          <el-upload
            style="display: inline-block; margin-top: -5px"
            ref="upload"
            action="string"
            accept=".xls, .xlsx"
            :limit="1"
            :on-exceed="handleExceed"
            :http-request="httpRequest"
            :auto-upload="false"
            :before-upload="beforeExcelUpload"
            :on-success="handleUploadSuccess"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <el-button :icon="Export">选择文件</el-button>
          </el-upload>
        </el-col>
        <el-col :span="4">
          <div class="actionClass downloadClass" @click="downloadUrl">
            下载模板
          </div>
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
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { ElMsgBox, ElMsgToast } from "@enn/ency-design";
import { importUser } from "@/api";
import { API_ENN_USER } from "@/const";

const exportTemplateURL = `${API_ENN_USER}/user/export-template?blade-auth=${localStorage.getItem(
  "blade-auth"
)}`;

const upload = ref();
const fileList = ref([]);
const upLoading = ref(false);
const msg = ref("");

const props = defineProps(["importVisible", "handleHidden", "getData"]);

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
        props.handleHidden();
        msg.value = `本次共解析${totalCount}条数据，其中${errorCount}条解析失败，导入${
          totalCount - errorCount
        }条。`;

        ElMsgBox.show(msg.value, "导入失败", {
          confirmButtonText: "关闭并下载错误文件",
          type: "error",
        }).then(() => {
          const exportErrorCSVURL: any = `${API_ENN_USER}/user/export-error/${errorId}?blade-auth=${localStorage.getItem(
            "blade-auth"
          )}`;
          window.location.href = exportErrorCSVURL;
        });
      } else {
        props.handleHidden();
        props.getData();
        msg.value = `本次共解析${totalCount}条数据，导入成功${totalCount}条数据`;
        ElMsgBox.show(msg.value, "导入成功", {
          confirmButtonText: "确认",
          type: "success",
        });
      }
      handleClear();
    })
    .catch((e) => {
      console.warn(e);
      handleClear();
    });
};
// 下载文件
const downloadUrl = () => {
  window.location.href = exportTemplateURL;
};

const handleClear = () => {
  upload.value.clearFiles();
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

<style scoped lang="less">
.downloadClass {
  margin-left: 20px;
  display: inline-block;
  margin-right: 20px;
}
</style>
