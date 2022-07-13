<template>
  <div class="member-container">
    <el-row class="handle-box" :gutter="20" align="middle">
      <el-col :span="5">
        <div>
          <div class="title">账号名</div>
          <el-input
            v-model="listQuery.account"
            placeholder="请输入"
            clearable
            class="handle-input mr10"
          ></el-input>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="title">昵称</div>
        <el-input
          v-model="listQuery.name"
          placeholder="请输入"
          clearable
          class="handle-input mr10"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <div class="title">手机号</div>
        <el-input
          v-model="listQuery.phone"
          placeholder="请输入"
          clearable
          class="handle-input mr10"
        ></el-input>
      </el-col>
      <el-col :span="9" style="text-align: right; margin-top: 22px">
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
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button @click="handleSearch">导入</el-button>
        <el-button @click="handleDelete">删除</el-button>
      </div>
      <el-table
        :header-cell-style="{ background: '#F6F7FB' }"
        :data="tableData"
        highlight-current-row
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="account" label="账户名" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="createTime" label="创建时间" />

        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <span @click="handleEdit(scope.row)" class="actionClass">编辑</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total,sizes, prev, pager, next, jumper"
          v-model:currentPage="listQuery.current"
          v-model:page-size="listQuery.size"
          :total="pageTotal"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { fetchData, deleteList } from "@/api/member";
import { ElMsgBox, ElMsgToast } from "@enn/ency-design";

const listQuery = reactive({
  account: "",
  name: "",
  phone: "",
  current: 1,
  size: 10,
});
const tableData = ref([]);
const pageTotal = ref(0);
const listLoading = ref(false);
const multipleSelection = ref([]);

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
// 获取表格数据
const getData = () => {
  listLoading.value = true;
  fetchData(listQuery).then((res) => {
    tableData.value = res.records;
    pageTotal.value = res.total || 50;
    listLoading.value = false;
  });
};
//添加操作
const handleAdd = () => {
  console.log(123);
};
// 删除操作
const handleDelete = () => {
  ElMsgBox.confirm("你确定要删除该用户么?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    buttonSize: "small",
  }).then(async () => {
    const result = multipleSelection.value.map((item) => item.id);
    const ids = result.join(",");
    await deleteList({ ids });
    await getData();
    ElMsgToast({
      type: "success",
      message: "删除成功",
    });
  });
};
// 查询操作
const handleSearch = () => {
  listQuery.current = 1;
  getData();
};
// 分页导航
const handlePageChange = (val) => {
  listQuery.current = val;
  getData();
};
const handleSizeChange = (val) => {
  listQuery.size = val;
  getData();
};
// 重置操作
const handleReset = () => {
  const data = {
    account: "",
    name: "",
    phone: null,
    current: 1,
    size: 10,
  };
  Object.assign(listQuery, data);
  multipleSelection.value = [];
  getData();
};

onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.title {
  font-size: 6px;
  color: #646566;
  margin-bottom: 7px;
}
.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: right;
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
