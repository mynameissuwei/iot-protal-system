<template>
  <div class="register-container">
    <div class="register-header">添加能力</div>
    <div class="register-content">
      <div class="register-content-header">基本信息</div>
      <div class="register-content-text">
        <el-form
          label-width="120px"
          ref="ruleFormRef"
          :rules="rules"
          :model="ruleForm"
        >
          <el-form-item label="能力名称" prop="account">
            <el-input v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item label="关联功能包" prop="name">
            <el-button @click="showDialog">选择功能包</el-button>
          </el-form-item>
          <div class="token-class">
            <el-token
              style="margin-right: 20px"
              max-width="200"
              v-if="Object.keys(multipleSelection).length"
              >{{ multipleSelection.applicationName }}</el-token
            >
          </div>
          <el-form-item label="能力描述" prop="phone">
            <el-input v-model="ruleForm.desc" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div class="register-footer">
        <el-button type="primary" @click="saveAdd(ruleFormRef)"
          >确 定</el-button
        >
        <el-button @click="editVisible = false">取 消</el-button>
      </div>
    </div>
    <el-dialog title="关联功能包" v-model="diagvisible" width="1000px">
      <el-table
        :header-cell-style="{ background: '#F6F7FB' }"
        :data="tableData"
        highlight-current-row
        ref="multipleTable"
        @current-change="handleSelectionChange"
        v-loading="listLoading"
      >
        <el-table-column width="40" type="radio">
          <template #default="scope">
            <el-radio
              style="
                display: flex;
                justify-content: center;
                flex-direction: column;
                flex-wrap: wrap;
              "
              v-model="currentRowId"
              :label="scope.row.productId"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column prop="appId" label="功能包编码" />
        <el-table-column prop="applicationName" label="应用名称" />
        <el-table-column prop="productDesc" label="产品描述" />
        <el-table-column prop="productName" label="产品名字" />
        <el-table-column prop="status" label="状态" />
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
      <div class="diag-footer">
        <el-button type="primary" @click="diagvisible = false">确 定</el-button>
        <el-button @click="diagvisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { roleListRegister, roleListConfirm } from "@/api";
import { useRouter } from "vue-router";

const router = useRouter();
//table
const listQuery = reactive({
  productName: "",
  current: 1,
  size: 10,
});
const currentRowId = ref(null);
const pageTotal = ref(0);
const listLoading = ref(false);
const multipleSelection = ref({});
const tableData = ref([]);
const showDialog = () => {
  diagvisible.value = true;
  getData();
};
//多选删除
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  console.log(val, "vallll");
  currentRowId.value = multipleSelection.value.productId;
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
// 获取表格数据
const getData = () => {
  listLoading.value = true;
  roleListRegister(listQuery).then((res) => {
    tableData.value = res.records;
    pageTotal.value = res.total || 50;
    listLoading.value = false;
  });
};
const saveAdd = () => {
  const data = {
    abilityName: ruleForm.account,
    remarks: ruleForm.desc,
    ...multipleSelection.value,
  };
  roleListConfirm(data).then((res) => {
    console.log(res, "ressss");
    router.push({
      path: "/ecologyAbility",
    });
  });
};
//分割线
const diagvisible = ref(false);
const rules = reactive({
  account: [
    { required: true, message: "请输入账号名", trigger: "change" },
    { min: 1, max: 20, message: "请输入1到20位", trigger: "change" },
  ],
  name: [{ min: 0, max: 20, message: "请输入0到20位", trigger: "change" }],
  desc: [{ min: 0, max: 20, message: "请输入0到20位", trigger: "change" }],
});
let ruleForm = reactive({
  account: "",
  name: "",
  desc: "",
});
</script>

<style lang="less" scoped>
.el-form-item {
  width: 400px;
}
.register-container {
  .register-header {
    height: 69px;
    line-height: 69px;
    background: #ffffff;
    font-size: 21px;
    font-weight: 500;
    color: #323233;
    padding-left: 20px;
  }
  .register-content {
    margin-top: 21px;
    background: #ffffff;
    .register-content-header {
      font-size: 18px;
      padding-left: 20px;
      padding-top: 20px;
    }
    .register-content-text {
      margin: 20px 0px 20px 60px;
    }
  }
  .register-footer {
    text-align: right;
    margin-right: 20px;
    padding-bottom: 20px;
  }
  .diag-footer {
    text-align: right;
    margin-right: 20px;
  }
  .pagination {
    margin: 20px 0;
    display: flex;
    justify-content: right;
  }
}
.token-class {
  margin-left: 120px;
  margin-bottom: 30px;
}
</style>
