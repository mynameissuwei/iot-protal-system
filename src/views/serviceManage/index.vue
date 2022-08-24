<template>
  <div class="table-orgain">
    <div class="info">
      <h3>{{ apiDetail.apiName }}</h3>
      <div style="background-color: yellowgreen; padding: 5px 0px; margin: 5px">
        <span style="background-color: cyan; padding: 4px 20px"
          >{{ apiDetail.httpMethod }}:</span
        >
        {{ apiDetail.requestPath }}
      </div>
      <el-descriptions :column="2">
        <el-descriptions-item label="昵称:">
          <span>{{ apiDetail.apiName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="昵称:">
          <span>{{ apiDetail.apiName }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="info">
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="账户名:">{{
          apiDetail.apiName
        }}</el-descriptions-item>
        <el-descriptions-item label="昵称:">
          <span>{{ apiDetail.apiName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="手机号:" label-class-name="info-label">
          <span>{{ apiDetail.apiName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间:">{{
          apiDetail.apiName
        }}</el-descriptions-item>
        <el-descriptions-item label="创建人:">
          {{ apiDetail.apiName }}
        </el-descriptions-item>
        <el-descriptions-item label="账号状态:">正常</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from "vue";
import { removeRole } from "@/api";

// /enn-operation-platform/info/doc/{id}
const apiDetail = reactive({
  apiName: "我是名称",
  protocolType: "http",
  version: "",
  httpMethod: "get",
  requestPath: "/2323/23",
  description: "",
  bodyExample: "",
  responseExample: "",
});

const parameterList = reactive([
  {
    paramName: "",
    description: "",
    paramPosition: "",
    isMast: "",
    paramType: "",
  },
]);

// 角色列表
const getRoleList = () => {
  //   listLoading.value = true;
};
const initData = () => {
  getRoleList();
};
onMounted(() => {
  initData();
});
</script>

<style lang="less" scoped>
.table-orgain {
  // height: 100%;
  // width: 100%;
  // display: flex;
  // flex-direction: column;
}
.info {
  background-color: white;
  margin-bottom: 20px;
  padding: 20px;
  .test {
  }
}
</style>
