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
        <el-button @click="handleImport">导入</el-button>
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
            <span
              @click="handleEdit(scope.row, 'view')"
              class="actionClass"
              style="margin-right: 10px"
              >查看</span
            >
            <span @click="handleEdit(scope.row, 'edit')" class="actionClass"
              >编辑</span
            >
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
      <!-- 导入弹出框 -->
      <v-upload
        :importVisible="importVisible"
        :handleHidden="handleHidden"
        :getData="getData"
      ></v-upload>
      <!-- 编辑弹出框 -->
      <el-dialog title="添加成员" v-model="editVisible" width="500px">
        <el-form
          label-width="90px"
          ref="ruleFormRef"
          :rules="rules"
          :model="ruleForm"
        >
          <el-form-item label="账号名" prop="account">
            <el-input v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <div class="userDiag">注：成员创建成功后，初始密码为账号名</div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="saveAdd(ruleFormRef)"
              >确 定</el-button
            >
            <el-button @click="editVisible = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchData, deleteList, createUser } from "@/api";
import { ElMsgBox, ElMsgToast } from "@enn/ency-design";
import { phonePattern } from "@/utils/pattern";
import vUpload from "../home";

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
const router = useRouter();

// 表格编辑时弹窗和保存
const ruleFormRef = ref();
const editVisible = ref(false);
const importVisible = ref(false);
const buttonLoadingRef = ref(false);
const rules = reactive({
  account: [
    { required: true, message: "请输入账号名", trigger: "change" },
    { min: 1, max: 20, message: "请输入1到20位", trigger: "change" },
  ],
  name: [{ min: 0, max: 20, message: "请输入0到20位", trigger: "change" }],
  phone: [
    {
      pattern: phonePattern,
      message: "手机号格式不对",
      trigger: "change",
    },
  ],
});
let ruleForm = reactive({
  account: "",
  name: "",
  phone: "",
});
const handleAdd = () => {
  const data = {
    account: null,
    name: null,
    phone: null,
  };
  Object.assign(ruleForm, data);
  editVisible.value = true;
};
const saveAdd = async (formEl) => {
  buttonLoadingRef.value = true;
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await createUser(ruleForm);
      await getData();
      buttonLoadingRef.value = false;
      editVisible.value = false;
      // ElMsgToast({
      //   type: "success",
      //   message: "添加成功",
      // });
    } else {
      console.log("error submit!", fields);
    }
  });
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
// 导入操作
const handleImport = () => {
  importVisible.value = true;
};
const handleHidden = () => {
  importVisible.value = false;
};
// 编辑
const handleEdit = (data, type) => {
  router.push({
    path: "/detail",
    query: {
      userId: data.id,
      tenantId: data.tenantId,
      type,
    },
  });
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
</style>
