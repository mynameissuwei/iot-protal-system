<template>
  <div class="member-container">
    <div class="view-container">
      <div class="table-box">
        <el-button type="primary" @click="handleResourceDialog"
          >编辑资源范围</el-button
        >
        <!-- <el-button @click="handleDelete">删除</el-button> -->
      </div>
      <el-table
        :header-cell-style="{ background: '#F6F7FB' }"
        :data="tableData"
        highlight-current-row
        ref="multipleTable"
        v-loading="listLoading"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="account" label="资源名称" />
        <el-table-column prop="name" label="资源标识" />
        <el-table-column prop="phone" label="资源类型" />
        <el-table-column prop="createTime" label="资源位置" />
        <!-- <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <span @click="handleEdit(scope.row, 'edit')" class="actionClass"
              >编辑数据权限</span
            >
          </template>
        </el-table-column> -->
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
      <el-dialog
        :width="320"
        v-model="dialogResourceVisible"
        title="编辑资源范围"
      >
        <div class="tree-body">
          <el-input v-model="filterText" placeholder="关键字搜索" />
          <el-tree
            ref="treeRef"
            :data="menuTreeData"
            show-checkbox
            node-key="id"
            :props="menuProps"
            :filter-node-method="filterNode"
            :default-checked-keys="selectKeys"
            @check-change="getCurrentSelectArray"
            style="margin-top: 10px"
          />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="editResource"> 确定 </el-button>
            <el-button @click="dialogResourceVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { fetchData, getMenuTree, getRolesTree, grantRoles } from "@/api";
import { ElMsgBox, ElMsgToast } from "@enn/ency-design";
import { MenuTreeData } from "@/types";

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
const importVisible = ref(false);

// 编辑资源范围弹窗
const menuProps = {
  label: "title",
  children: "children",
};

const dialogResourceVisible = ref(false);
const selectKeys = ref([]);
const filterText = ref("");
const roleIds = "1529740265311748097"; // 当前角色id
const menuTreeData = ref<MenuTreeData[]>([]);
const treeRef: any = ref<HTMLElement | null>(null);

// 打开资源范围弹窗
const handleResourceDialog = () => {
  getRolesTree({ roleIds }).then((res) => {
    selectKeys.value = res;
  });
  dialogResourceVisible.value = true;
};

// 编辑资源范围确定
const editResource = () => {
  grantRoles({
    roleIds: [roleIds],
    menuIds: selectKeys.value,
  }).then((res) => {
    console.log(res);
    ElMsgToast({
      message: "编辑成功！",
    });
    dialogResourceVisible.value = false;
  });
};

// 监听搜索
watch(filterText, (val) => {
  treeRef.value?.filter(val);
});

// 获取选择树节点
const getCurrentSelectArray = () => {
  selectKeys.value = treeRef.value?.getCheckedKeys();
};

const filterNode = (value: string, data: MenuTreeData) => {
  if (!value) return true;
  return data.title.includes(value);
};
//多选删除
// const handleSelectionChange = (val) => {
//   multipleSelection.value = val;
// };
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
// const handleDelete = () => {
//   ElMsgBox.confirm("你确定要删除该用户么?", "警告", {
//     confirmButtonText: "确认",
//     cancelButtonText: "取消",
//     type: "warning",
//     buttonSize: "small",
//   }).then(async () => {
//     const result = multipleSelection.value.map((item) => item.id);
//     const ids = result.join(",");
//     await deleteList({ ids });
//     await getData();
//     ElMsgToast({
//       type: "success",
//       message: "删除成功",
//     });
//   });
// };
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
      type,
    },
  });
};
onMounted(() => {
  getData();
  getMenuTree().then((res) => {
    console.log(res);
    menuTreeData.value = res;
  });
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
.tree-body {
  max-height: 600px;
  overflow-y: auto;
}
</style>
