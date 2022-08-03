<template>
  <div class="table-orgain">
    <div class="header-bg-box">
      <div class="header-bar-demo">
        <el-header-action-bar :button-group="originData.buttonGroup">
          <el-input
            v-model="roleListQuery.roleName"
            placeholder="请输入角色名称"
            @change="searchRoleFn"
            clearable
            class="handle-input mr10 roleSearch"
          ></el-input>
        </el-header-action-bar>
      </div>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      @selection-change="roleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-link
            class="actionClass"
            :underline="false"
            @click="roleEdit(scope.row)"
            >编辑</el-link
          >
          <el-link
            class="actionClass edit-link-view"
            :underline="false"
            @click="roleView(scope.row)"
            >查看用户</el-link
          >
          <el-link
            class="actionClass"
            :underline="false"
            @click="roleOrgan(scope.row)"
            >管理角色权限</el-link
          >
        </template>
      </el-table-column>
      <template #empty>
        <el-msg-page>
          <template #icon>
            <img src="/images/no-search-result.svg" alt="" />
          </template>
          <template #subTitle>
            <div>暂无角色</div>
          </template>
        </el-msg-page>
      </template>
    </el-table>
    <div class="pagination">
      <el-pagination
        :layout="PAGINATION_CONFIG"
        v-model:currentPage="roleListQuery.current"
        v-model:page-size="roleListQuery.size"
        :total="roleTotalNum"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
    <el-dialog v-model="dialogRoleVisible" :title="roleDialogTit">
      <el-form :model="roleForm" label-width="120px" :rules="roleRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            autocomplete="off"
            placeholder="最多50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色定位描述" prop="description">
          <el-input
            v-model="roleForm.description"
            autocomplete="off"
            type="textarea"
            maxlength="100"
            show-word-limit
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addRole(roleForm)">
            确认
          </el-button>
          <el-button @click="dleOrgan">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from "vue";
import {
  ElHeaderActionBar,
  HeaderActionButtonGroupItem,
  ElMsgBox,
  ElMsgToast,
  ElPagination,
  ElInput,
} from "@enn/ency-design";
import { Edit, Delete } from "@enn/ency-design-icons";
import { removeRole, roleListApi, roleAddApi } from "@/api";
import { useRouter } from "vue-router";
import { PAGINATION_CONFIG } from "@/const";
const originData = reactive({
  buttonGroup: [
    {
      label: "添加角色",
      icon: markRaw(Edit),
      buttonType: "primary",
      operateType: "business",
      cb: () => {
        addRoleFn();
      },
    },
    {
      label: "删除",
      icon: markRaw(Delete),
      buttonType: "secondary",
      operateType: "business",
      cb: () => {
        deleteRoleFn();
      },
    },
  ] as HeaderActionButtonGroupItem[],
});

const router = useRouter();
const dialogRoleVisible = ref(false);
const roleForm = reactive({
  roleName: "",
  description: "",
});
const tableData = ref([]);
const refRoleList = ref([]);
const roleDialogTit = ref("添加角色");
// 分页数据
const roleTotalNum = ref(0);
const roleListQuery = reactive({
  roleAlias: null,
  roleName: null,
  current: 1,
  size: 10,
});
const roleRules = reactive({
  roleName: [
    { required: true, message: "角色名称不能为空", trigger: "change" },
  ],
});

const addRoleFn = () => {
  dialogRoleVisible.value = true;
};
// 删除成员
const deleteRoleFn = () => {
  console.log(1111, refRoleList.value.length);
  if (refRoleList.value.length) {
    ElMsgBox.confirm("你确定要删除吗?", "删除角色", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      const result = refRoleList.value.map((item) => item.id);
      let refData = {
        ids: result.join(","),
      };
      removeRole(refData)
        .then((res) => {
          ElMsgToast({
            type: "success",
            message: "删除成功",
          });
        })
        .finally(() => {
          getRoleList();
        });
    });
  } else {
    ElMsgToast({
      type: "warning",
      message: "请勾选将要删除的角色~",
    });
  }
};
const roleSelectionChange = (val: never[]) => {
  refRoleList.value = val;
};
// 角色列表
const getRoleList = () => {
  //   listLoading.value = true;
  roleListApi(roleListQuery).then((res) => {
    if (res.records) {
      tableData.value = res.records;
      roleTotalNum.value = res.total;
      //   listLoading.value = false;
    } else {
      tableData.value = [];
      ElMsgToast({
        type: "warning",
        message: "暂无角色~",
      });
    }
  });
};
// 搜索
const searchRoleFn = () => {
  roleListApi(roleListQuery).then((res) => {
    if (res.records) {
      tableData.value = res.records;
      roleTotalNum.value = res.total;
    } else {
      tableData.value = [];
      ElMsgToast({
        type: "warning",
        message: "暂无角色~",
      });
    }
  });
};
// 编辑
const roleEdit = (data: any) => {
  roleDialogTit.value = "编辑角色";
  dialogRoleVisible.value = true;
  roleForm.description = data.description;
  roleForm.roleName = data.roleName;
  roleForm.id = data.id;
};
// 查看
const roleView = (data: { id: number }) => {
  console.log(111111, data);
  router.push({
    path: "/roleList",
    query: {
      roleId: data.id,
    },
  });
};
// 管理
const roleOrgan = (data: { id: number }) => {
  router.push({
    path: "/role",
    query: {
      roleId: data.id,
    },
  });
};
// 新增/编辑保存
const addRole = (roleForm: any) => {
  console.log("保存", roleForm.roleName);
  if (roleForm.roleName != "") {
    roleAddApi(roleForm).then((res) => {
      if (roleForm.id) {
        ElMsgToast({
          type: "success",
          message: `${roleForm.roleName} 角色编辑成功~`,
        });
      } else {
        ElMsgToast({
          type: "success",
          message: `${roleForm.roleName} 角色新增成功~`,
        });
      }
      getRoleList();
      dialogRoleVisible.value = false;
    });
  } else {
    ElMsgToast({
      type: "warning",
      message: "请输入角色名称~",
    });
  }
};
const dleOrgan = () => {
  dialogRoleVisible.value = false;
};

// 分页
const handleSizeChange = (val: number) => {
  roleListQuery.size = val;
  getRoleList();
};
const handlePageChange = (val: number) => {
  roleListQuery.current = val;
  getRoleList();
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
  background: #fff;
  padding: 15px 16px 10px 16px;
}
.header-bg-box {
  height: 62px;
  width: calc(100% - 20px);
  width: 100%;
  top: 100px;
  min-width: 200px;
  .header-bar-demo .el-header-action-bar {
    padding: 0;
    position: relative;
    .actionBar-tit {
      position: absolute;
      top: 10px;
      font-size: 16px;
      font-weight: 400;
      color: #323233;
    }
    .roleSearch {
      display: inline-block;
      display: inline-block;
      width: 276px;
      position: absolute;
      top: 12px;
      right: 206px;
    }
  }
}
.edit-link-view {
  display: inline-block;
  margin: 0 16px;
}
</style>
