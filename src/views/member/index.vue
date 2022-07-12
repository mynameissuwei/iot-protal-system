<template>
  <div>
    <el-row class="handle-box" :gutter="20" align="middle">
      <el-col :span="7">
        <div>
          <div class="title">账号名</div>
          <el-input
            v-model="listQuery.ruleName"
            placeholder="自定义规则名称"
            clearable
            class="handle-input mr10"
          ></el-input>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="title">昵称</div>
        <el-input
          v-model="listQuery.updatedByName"
          placeholder="最后修改人"
          clearable
          class="handle-input mr10"
        ></el-input>
      </el-col>
      <el-col :span="7">
        <div class="title">手机号</div>
        <el-select
          v-model="listQuery.releaseStatus"
          clearable
          placeholder="状态"
        >
          <el-option
            v-for="item in [
              { value: 0, label: '未发布' },
              { value: 1, label: '已发布' },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="3" style="text-align: right">
        <el-button type="primary" size="small" @click="handleSearch"
          >查询</el-button
        >
        <el-button size="small" @click="handleReset" color="#F2F3F5"
          >重置</el-button
        >
      </el-col>
    </el-row>
    <div class="view-container">
      <div class="table-box">
        <el-button type="primary" @click="handleSearch">添加</el-button>
        <el-button @click="handleSearch">导入</el-button>
        <el-button @click="handleSearch">删除</el-button>
      </div>
      <el-table
        :header-cell-style="{ background: '#F6F7FB' }"
        max-height="450"
        :data="tableData"
        highlight-current-row
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="测试中文Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <span @click="handleEdit(scope.row)" class="actionClass">编辑</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="listQuery.pageIndex"
          :page-size="listQuery.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { fetchData } from "../api/member";

const listQuery = reactive({
  ruleName: "",
  updatedByName: "",
  releaseStatus: null,
  pageIndex: 1,
  pageSize: 10,
});
const tableData = ref([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
]);
const pageTotal = ref(0);
const listLoading = ref(false);
const multipleSelection = ref([]);

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
// 获取表格数据
const getData = () => {
  fetchData(listQuery).then((res) => {
    tableData.value = res.list;
    pageTotal.value = res.pageTotal || 50;
  });
};
// 查询操作
const handleSearch = () => {
  listQuery.pageIndex = 1;
  getData();
};
// 分页导航
const handlePageChange = (val) => {
  listQuery.pageIndex = val;
  getData();
};
</script>

<style scoped lang="less">
.title {
  font-size: 6px;
  color: #646566;
  margin-bottom: 5px;
}
.handle-box {
  height: 100px;
  margin-bottom: 7px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  background: #fff;
}
.table-box {
  text-align: right;
  margin-bottom: 20px;
}
</style>
