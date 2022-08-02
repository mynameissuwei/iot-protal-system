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
import { useRoute, useRouter } from "vue-router";
import { getRoleListMenu } from "@/api";
import { MenuTreeData } from "@/types";
const route = useRoute();
const roleId = ref(route.query.roleId) ?? "1123598816738675201";

const initListQueryData = {
  roleId: "1123598816738675201",
  current: 1,
  size: 10,
};

const listQuery = reactive(initListQueryData);
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
const tableColumns = [
  {
    title: "资源名称",
    key: "name",
    // width: "120",
  },
  {
    title: "资源标识",
    key: "code",
    // width: "120",
  },
  {
    title: "资源类型",
    key: "category",
    width: "120",
    render: (row) => {
      return +row.category === 1 ? "菜单" : "按钮";
    },
  },
  {
    title: "资源位置",
    key: "path",
    width: "340",
  },
];

const dialogResourceVisible = ref(false);
const selectKeys = ref([]);
const filterText = ref("");
const roleIds = "1529740265311748097"; // 当前角色id
const menuTreeData = ref<MenuTreeData[]>([]);
const treeRef: any = ref<HTMLElement | null>(null);

// // 打开资源范围弹窗
// const handleResourceDialog = () => {
//   getRolesTree({ roleIds }).then((res) => {
//     selectKeys.value = res;
//   });
//   dialogResourceVisible.value = true;
// };

// // 编辑资源范围确定
// const editResource = () => {
//   grantRoles({
//     roleIds: [roleIds],
//     menuIds: selectKeys.value,
//   }).then((res) => {
//     console.log(res);
//     ElMsgToast({
//       message: "编辑成功！",
//     });
//     dialogResourceVisible.value = false;
//   });
// };

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
  getRoleListMenu(listQuery).then((res) => {
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
  Object.assign(listQuery, initListQueryData);
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
