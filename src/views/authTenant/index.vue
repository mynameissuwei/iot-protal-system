<template>
  <div class="table-orgain">
    <div class="header-bg-box">
      <div class="header-bar-demo">
        <el-header-action-bar :button-group="originData.buttonGroup">
          <el-input
            v-model="roleListQuery.tenantName"
            placeholder="请输入租户名称"
            @change="searchTenant"
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
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="tenantName" label="租户名称" width="180" />
      <el-table-column prop="tenantId" label="租户ID" width="180" />
      <el-table-column prop="authorizationTime" label="授权时间" width="180" />
      <el-table-column prop="admin" label="物联管理员" />
      <el-table-column fixed="right" label="操作" width="330">
        <template #default="scope">
          <el-link
            class="actionClass"
            :underline="false"
            @click="configBtn(scope.row)"
            >配置功能权限</el-link
          >
          <el-link
            class="actionClass edit-link-view"
            :underline="false"
            @click="startBtn(scope.row)"
            >配置生态能力</el-link
          >
          <el-link
            class="actionClass"
            :underline="false"
            @click="settingBtn(scope.row)"
            >设定物联管理员</el-link
          >
        </template>
      </el-table-column>
      <template #empty>
        <el-msg-page>
          <template #icon>
            <img src="/images/no-search-result.svg" alt="" />
          </template>
          <template #subTitle>
            <div>暂无授权租户</div>
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
    <el-dialog
      :before-close="handleCloseConfig"
      :width="320"
      v-model="dialogConfigVisible"
      title="配置功能权限"
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
          <el-button type="primary" @click="editConfig"> 确定 </el-button>
          <el-button @click="dialogConfigVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :width="400" title="配置生态能力" v-model="dialogStartVisible">
      <el-form>
        <el-form-item label="可配置" class="mb-3">
          <el-checkbox-group v-model="checkStart" align="horizontal">
            <el-checkbox
              v-for="data in gitListCheck"
              :label="data.productId"
              :key="data.abilityName"
              :value="data.abilityName"
            >
              {{ data.abilityName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="startSave"> 确定 </el-button>
          <el-button @click="dialogStartVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 管理员弹窗 -->
    <el-dialog :width="400" title="设定物联管理员" v-model="dialogAdminVisible">
      <p class="dialogClass">
        <span class="blockMark"></span>
        <span class="blockTit">已添加（{{ checkedList.length }}）</span>
        <el-button text class="clearBtn" @click="clearRealName">清空</el-button>
      </p>
      <div class="mt-4 yetChackBox">
        <el-combo-box
          v-model="checkedList"
          display
          multiple
          :max-token-count="5"
        >
          <el-option
            v-for="item in AdminList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-combo-box>
      </div>
      <p class="dialogClass">
        <span class="blockMark"></span><span class="blockTit">添加人员</span>
      </p>
      <div class="mt-4 selectTag">
        <el-combo-box v-model="checkedList" multiple>
          <el-option
            v-for="item in AdminList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-combo-box>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="adminSave"> 确定 </el-button>
          <el-button @click="dialogAdminVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from "vue";
import {
  HeaderActionButtonGroupItem,
  ElMsgBox,
  ElMsgToast,
  ElPagination,
  ElInput,
  ElComboBox,
  ElOption,
} from "@enn/ency-design";
// import { ElChoosePeo } from "@enn/ency-design-biz";
import { Edit } from "@enn/ency-design-icons";
import {
  getMenuListTree,
  getCheckMenuList,
  getAuthList,
  tenantAuthAdd,
  getEcologyListCheck,
  editEcologyListCheck,
  getAdminList,
  getYetAdminList,
  editAdminList,
} from "@/api";
import { useRouter } from "vue-router";
import { PAGINATION_CONFIG } from "@/const";
import { MenuTreeData } from "@/types";
const treeRef = ref<HTMLElement | null>(null);

const originData = reactive({
  buttonGroup: [
    {
      label: "搜索",
      icon: markRaw(Edit),
      buttonType: "primary",
      operateType: "business",
      cb: () => {
        searchTenant();
      },
    },
  ] as HeaderActionButtonGroupItem[],
});

const router = useRouter();
const tenantIdAuth = ref("");
const tenantIdSet = ref("");
const adminAccountAuth = ref("");
const dialogConfigVisible = ref(false);
const dialogStartVisible = ref(false);
const dialogAdminVisible = ref(false);
const AdminList = ref([]);
const realName = ref("");
const checkedList = ref([
  // {
  //   empNo: "10070532",
  //   realName: "王秭骁",
  // },
]);
const selectKeys = ref([]);
const menuTreeData = ref<MenuTreeData[]>([]);
const gitListCheck = ref([]);
const checkStart = ref([]);
const filterText = ref([]);
const menuProps = {
  label: "title",
  children: "children",
};
const tableData = ref([]);
// 分页数据
const roleTotalNum = ref(0);
const roleListQuery = reactive({
  roleAlias: null,
  tenantName: null,
  current: 1,
  size: 10,
});
// 设定管理员
const options = ref([
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
]);
// 配置功能权限
const configBtn = (row) => {
  console.log("配置", row);
  tenantIdAuth.value = row.tenantId;
  selectKeys.value = [];
  getCheckMenuList({ roleIds: row.roleId }).then((res) => {
    selectKeys.value = res;
    dialogConfigVisible.value = true;
    console.log(44444, res, selectKeys.value);
    // debugger;
  });
};
// const handleCloseConfig = () => {
//   selectKeys.value = [];
// };
// 配置功能权限确定
const editConfig = () => {
  tenantAuthAdd({
    tenantId: tenantIdAuth.value,
    menuIds: selectKeys.value,
  })
    .then(() => {
      ElMsgToast({
        message: "配置成功！",
      });
    })
    .finally(() => {
      dialogConfigVisible.value = false;
      initData();
    });
};
// 获取功能权限check节点
const getCurrentSelectArray = () => {
  selectKeys.value = treeRef.value?.getCheckedKeys();
  console.log(787878, selectKeys.value);
  // debugger;
};
const filterNode = (value: string, data: MenuTreeData) => {
  if (!value) return true;
  return data.title.includes(value);
};
// 生态能力
const startBtn = (row) => {
  console.log("启用", row);
  tenantIdAuth.value = row.tenantId;
  adminAccountAuth.value = row.adminAccount;
  getEcologyListCheck({ tenantId: row.tenantId }).then((res) => {
    if (res) {
      gitListCheck.value = res;
    } else {
      gitListCheck.value = [];
      ElMsgToast({
        type: "warning",
        message: "暂无可用生态能力~",
      });
    }
  });
  dialogStartVisible.value = true;
};
const startSave = () => {
  console.log(77777, checkStart, checkStart.value);
  let checkStartList = JSON.parse(JSON.stringify(checkStart.value));
  console.log(99999, checkStartList);
  editEcologyListCheck({
    tenantId: tenantIdAuth.value,
    productIds: checkStartList,
    adminAccount: adminAccountAuth.value,
  })
    .then(() => {
      ElMsgToast({
        message: "生态能力配置成功！",
      });
    })
    .finally(() => {
      // dialogStartVisible.value = false;
      tenantIdAuth.value = "";
      adminAccountAuth.value = "";
      dialogStartVisible.value = false;
      initData();
    });
};
// 设定
const settingBtn = (row) => {
  console.log("设定");
  dialogAdminVisible.value = true;
  tenantIdSet.value = row.tenantId;
  getAdminList().then((res) => {
    console.log("所有管理员", res);
    // var idsStr = res
    //   .map(function (obj, index) {
    //     return obj.id;
    //   })
    //   .join(",");
    // var AdminListRes = JSON.parse(idsStr);
    // console.log(6666, idsStr, AdminListRes, JSON.parse(idsStr));
    AdminList.value = res;
  });
  getYetAdminList({ tenantId: row.tenantId }).then((res) => {
    console.log("返显管理员", res.records);
    checkedList.value = res.records;
  });
};
const clearRealName = () => {
  realName.value = "";
  checkedList.value = [];
};
const adminSave = () => {
  console.log(11111, realName.value);
  let realNamesA = JSON.stringify(realName.value);
  let realNames = JSON.parse(realNamesA);
  console.log(realNames);
  debugger;
  editAdminList({
    tenantId: tenantIdSet.value,
    ids: realNames,
  }).then((res) => {
    console.log(222, res);
  });
  // dialogAdminVisible.value = false;
};

// 租户列表
const getTenantList = () => {
  getAuthList(roleListQuery).then((res) => {
    if (res.records) {
      tableData.value = res.records;
      roleTotalNum.value = res.total;
    } else {
      tableData.value = [];
      ElMsgToast({
        type: "warning",
        message: "暂无租户~",
      });
    }
  });
};
// 搜索
const searchTenant = () => {
  getAuthList(roleListQuery).then((res) => {
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
// const handleChoosePeo = () => {
//   dialogAdminVisible.value = true;
// };
// 分页
const handleSizeChange = (val: number) => {
  roleListQuery.size = val;
  getTenantList();
};
const handlePageChange = (val: number) => {
  roleListQuery.current = val;
  getTenantList();
};
const initData = () => {
  getTenantList();
};
onMounted(() => {
  initData();
  getMenuListTree().then((res) => {
    menuTreeData.value = res;
    console.log(343434, menuTreeData.value);
  });
});
</script>

<style lang="less" scoped>
.table-orgain {
  background: #fff;
  padding: 15px 16px 10px 16px;
}
.yetChackBox {
  margin-bottom: 46px;
}
.dialogClass {
  position: relative;
  height: 24px;
  margin-bottom: 20px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #323233;
  line-height: 24px;
  .blockMark {
    position: absolute;
    top: 2px;
    margin-right: 12px;
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #4068d4;
    border-radius: 0px 2px 2px 0px;
  }
  .blockTit {
    position: absolute;
    top: -2px;
    left: 16px;
  }
  .clearBtn {
    position: absolute;
    right: -12px;
    top: -4px;
  }
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
      right: 100px;
    }
    .header-btn {
      position: absolute;
      top: 12px;
      right: 1px;
    }
  }
}
.edit-link-view {
  display: inline-block;
  margin: 0 16px;
}
.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: right;
}
::v-deep .selectTag .el-select {
  width: 100%;
}
</style>
