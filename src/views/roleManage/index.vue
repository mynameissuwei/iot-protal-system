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
        <el-button type="primary" @click="relevanceMember">关联成员</el-button>
        <el-button @click="handleDelete">移除成员</el-button>
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

      <el-dialog
        :width="600"
        v-model="dialogConnectMemberVisible"
        title="关联组织成员"
        custom-class="connectSelect"
      >
        <p class="conect-title">选择关联成员:</p>
        <el-combo-box
          v-model="connectValue"
          multiple
          remote
          reserve-keyword
          placeholder="输入昵称或账号名查找"
          :remote-method="remoteMethod"
          :loading="connectLoading"
          style="width: 420px"
        >
          <el-option
            v-for="item in connectOptions"
            :key="item.id"
            :label="`${item.account}(${item.name ? item.name : '无昵称'})`"
            :value="item.id"
          />
        </el-combo-box>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              v-loading="connectButtonLoading"
              @click="connectMember"
            >
              确定
            </el-button>
            <el-button @click="dialogConnectMemberVisible = false"
              >取消</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { fetchData, deleteList, addConnectMember } from "@/api/roleManage";
import { ElMsgBox, ElMsgToast } from "@enn/ency-design";
import { geQueryUserList } from "@/api/organ";

const listQuery = reactive({
  roleId: "1123598816738675201",
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
//关联组织成员
const orgMsg = reactive({
  deptName: "",
  id: "1",
  createTime: "2022-07-18",
});
const dialogConnectMemberVisible = ref(false);
let connectValue = ref([]);
const connectLoading = ref(false);
const connectButtonLoading = ref(false);
const connectOptions = ref([]);
const relevanceMember = () => {
  dialogConnectMemberVisible.value = true;
  connectValue.value = [];
};
const getConnectUserData = (query = "") => {
  let page = { current: 1, size: 20 };
  geQueryUserList({ keyword: query, ...page }).then((res) => {
    connectLoading.value = false;
    connectOptions.value = res.records;
  });
};
const remoteMethod = (query) => {
  if (query) {
    connectLoading.value = true;
    getConnectUserData(query);
  }
};
const connectMember = () => {
  connectButtonLoading.value = true;
  addConnectMember({
    roleId: listQuery.roleId,
    orgId: orgMsg.id,
    userList: connectValue.value,
  }).then(() => {
    dialogConnectMemberVisible.value = false;
    ElMsgToast({
      type: "success",
      message: "关联组织成员成功",
    });
    getData();
  });
  connectButtonLoading.value = false;
};

//多选删除
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
// 删除操作
const handleDelete = () => {
  ElMsgBox.confirm("你确定要删除该成员么?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    buttonSize: "small",
  }).then(async () => {
    const userList = multipleSelection.value.map((item) => item.id);

    await deleteList({ userList, roleId: listQuery.roleId });
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
  getConnectUserData();
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
  padding: 0px 16px;
  background: #fff;
}
.table-box {
  text-align: right;
  margin-bottom: 20px;
}
.userDiag {
  margin-left: 90px;
}
:deep(.el-dialog.connectSelect .el-select__input) {
  height: 40px !important;
}
.conect-title {
  display: inline-block;
  margin-right: 12px;
}
</style>
