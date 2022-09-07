<template>
  <div class="table-orgain">
    <div class="header-bg-box">
      <div class="header-bar-demo">
        <el-header-action-bar :button-group="originData.buttonGroup">
          <el-input
            v-model="roleListQuery.roleName"
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
      @selection-change="roleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="roleName" label="租户名称" width="180" />
      <el-table-column prop="tenantName" label="租户ID" width="180" />
      <el-table-column prop="tenantName" label="授权时间" width="240" />
      <el-table-column prop="roleName" label="物联管理员" width="180" />
      <el-table-column fixed="right" label="操作">
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
            >启用生态能力</el-link
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
} from "@enn/ency-design";
import { Edit } from "@enn/ency-design-icons";
import { roleListApi } from "@/api";
import { useRouter } from "vue-router";
import { PAGINATION_CONFIG } from "@/const";
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
const roleForm = reactive({
  roleName: "",
  description: "",
  id: "",
});
const tableData = ref([]);
// 分页数据
const roleTotalNum = ref(0);
const roleListQuery = reactive({
  roleAlias: null,
  roleName: null,
  current: 1,
  size: 10,
});

const addRoleFn = () => {
  roleForm.description = "";
  roleForm.roleName = "";
  roleForm.id = "";
};
// 配置
const configBtn = () => {
  console.log("配置");
};
// 启用
const startBtn = () => {
  console.log("启用");
};
// 设定
const settingBtn = () => {
  console.log("设定");
};

// 租户列表
const getTenantList = () => {
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
// 搜索
const searchTenant = () => {
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
</style>
