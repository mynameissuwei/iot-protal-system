<template>
  <div class="table-orgain">
    <div class="info">
      <h3>{{ apiDetail.apiName }}</h3>
      <div
        :style="{
          'background-color': API_COLOR[apiDetail.httpMethod].backgroundColor,
          padding: '5px 0px',
          margin: '5px',
        }"
      >
        <span
          :style="{
            'background-color': API_COLOR[apiDetail.httpMethod].color,
            padding: '4px 20px',
            'border-radius': '5px',
          }"
          >{{ apiDetail.httpMethod }}:</span
        >
        {{ apiDetail.requestPath }}
      </div>
      <el-descriptions :column="2">
        <el-descriptions-item label="协议:">
          <span>{{ apiDetail.protocolType }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="版本:">
          <span>{{ apiDetail.version }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="info">
      <el-descriptions title="接口描述" :column="1">
        <el-descriptions-item label="">{{
          apiDetail.description
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="info">
      <el-descriptions title="请求示例" :column="1">
        <el-descriptions-item label="">{{
          apiDetail.bodyExample
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="info">
      <!-- <el-descriptions title="请求参数" :column="1"> -->
      <!-- <el-descriptions-item label=""> -->
      请求参数
      <el-table
        :header-cell-style="{ background: '#F6F7FB' }"
        :data="parameterList"
        highlight-current-row
        ref="multipleTable"
      >
        <el-table-column
          v-for="item in tableColumns"
          :key="item.key"
          :prop="item.key"
          :label="item.title"
          :width="item.width"
        >
          <template v-if="item.render" #default="scope">
            <div class="flex items-center">
              <el-avatar
                v-if="item.avatar"
                shape="square"
                :size="20"
                fit="fill"
                :src="scope.row.avatarSrc"
              ></el-avatar>
              <span v-html="item.render(scope.row)"></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-descriptions-item> -->
      <!-- </el-descriptions> -->
    </div>
    <div class="info">
      <el-descriptions title="响应示例" :column="1">
        <el-descriptions-item label="">{{
          apiDetail.responseExample
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getInfoDoc } from "@/api";
import { API_COLOR } from "@/const";

const route = useRoute();

// /enn-operation-platform/info/doc/{id}
const apiDetail = ref({
  apiName: "API名称",
  protocolType: "",
  version: "",
  httpMethod: "GET",
  requestPath: "",
  description: "",
  bodyExample: "",
  responseExample: "",
});

const parameterList = ref([
  {
    paramName: "",
    description: "",
    paramPosition: "",
    isMast: "",
    paramType: "",
  },
]);

const tableColumns = [
  {
    title: "参数名称",
    key: "paramName",
    // width: "120",
  },
  {
    title: "参数名称",
    key: "description",
    // width: "120",
  },
  {
    title: "请求类型",
    key: "paramPosition",
    // width: "120",
  },
  {
    title: "是否必填",
    key: "isMast",
    // width: "540",
    // render: (row: { isMast: string | number }) => {
    //   switch (row.isMast) {
    //     case 0:
    //       return "否";
    //     case 1:
    //       return "是";
    //     default:
    //       return "-";
    //   }
    // },
  },
  {
    title: "数据类型",
    key: "paramType",
    // width: "540",
  },
];

// 角色列表
const getApiInfo = () => {
  const params = {
    id: route.query.apiId,
  };
  getInfoDoc(params).then((res) => {
    apiDetail.value = res;
    parameterList.value = res.parameterList;
  });
};
const initData = () => {
  getApiInfo();
};

onMounted(() => {
  initData();
});
</script>

<style lang="less" scoped>
.table-orgain {
}
.info {
  background-color: white;
  margin-bottom: 20px;
  padding: 20px;
}
</style>
