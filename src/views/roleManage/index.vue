<template>
  <div class="table-orgain">
    <div class="header-bg-box">
      <div class="header-bar-demo">
        <el-header-action-bar :button-group="originData.buttonGroup">
          <el-input
            v-model="roleListQuery.roleName"
            placeholder="请输入角色名称"
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
            @click="roleEdit(scope.row.id)"
            >编辑</el-link
          >
          <el-link
            class="actionClass edit-link-view"
            :underline="false"
            @click="roleView(scope.row.id)"
            >查看用户</el-link
          >
          <el-link
            class="actionClass"
            :underline="false"
            @click="roleOrgan(scope.row.id)"
            >管理角色权限</el-link
          >
          <el-dialog v-model="dialogRoleVisible" title="添加角色">
            <el-form :model="roleForm" :rules="rules" ref="ruleFormRef">
              <el-form-item label="角色名称" prop="roleName">
                <el-input
                  v-model="roleForm.roleName"
                  autocomplete="off"
                  placeholder="最多50个字符"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="角色定位描述"
                :label-width="formLabelWidth"
                prop="description"
              >
                <el-input
                  v-model="roleForm.description"
                  autocomplete="off"
                  type="textarea"
                  placeholder="请输入描述"
                ></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="addRole(ruleFormRef)">
                  确认
                </el-button>
                <el-button @click="dleOrgan">取消</el-button>
              </span>
            </template>
          </el-dialog>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from "vue";
import {
  ElHeaderActionBar,
  HeaderActionButtonGroupItem,
  ElMsgBox,
  ElMsgToast,
} from "@enn/ency-design";
import { Edit, Delete } from "@enn/ency-design-icons";
import { refRoleApi, roleListApi } from "@/api/role";
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

const dialogRoleVisible = ref(false);
const roleForm = reactive({
  roleName: "",
  description: "",
});
const tableData = ref([]);
const refRoleList = ref([]);
const roleListQuery = reactive({
  roleAlias: "",
  roleName: "",
  current: 1,
  size: 10,
});

const addRoleFn = () => {
  dialogRoleVisible.value = true;
  console.log("新增角色", dialogRoleVisible.value);
};
// 删除成员
const deleteRoleFn = () => {
  ElMsgBox.confirm("你确定要移除用户么?", "移除成员", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const result = refRoleList.value.map((item) => item.id);
    let refData = {
      uids: result,
    };
    await refRoleApi(refData);
    ElMsgToast({
      type: "success",
      message: "删除成功",
    });
  });
};
const roleSelectionChange = (val: never[]) => {
  refRoleList.value = val;
};
// 角色列表
const getRoleList = () => {
  console.log("111");
  //   listLoading.value = true;
  roleListApi(roleListQuery).then((res) => {
    if (res.records) {
      tableData.value = res.records;
      //   pageTotal.value = res.total || 50;
      console.log(222, res.records);
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
// 编辑
const roleEdit = (id) => {
  console.log(id);
};
// 查看
const roleView = (id) => {
  console.log(id);
};
// 管理
const roleOrgan = (id) => {
  console.log(id);
};
// 新增保存
const addRole = (roleForm: unknown) => {
  console.log("保存", roleForm);
};
const dleOrgan = () => {
  dialogRoleVisible.value = false;
};

const initData = () => {
  console.log("init");
  getRoleList();
};
onMounted(() => {
  console.log("00001");
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
