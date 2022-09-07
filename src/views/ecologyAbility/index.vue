<template>
  <div class="table-orgain">
    <div class="header-bg-box">
      <div class="header-bar-demo">
        <el-header-action-bar :button-group="originData.buttonGroup">
          <el-button
            class="header-btn"
            @click="deleteRoleFn()"
            :disabled="!refRoleList.length"
            >删除</el-button
          >
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
      <el-table-column prop="roleName" label="能力名称" width="180" />
      <el-table-column prop="tenantName" label="应用名称(参与者)" width="180" />
      <el-table-column prop="tenantName" label="功能包名称" width="240" />
      <el-table-column prop="roleName" label="功能包id" width="180" />
      <el-table-column prop="roleName" label="备注" />
      <template #empty>
        <el-msg-page>
          <template #icon>
            <img src="/images/no-search-result.svg" alt="" />
          </template>
          <template #subTitle>
            <div>暂无可用能力</div>
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
      label: "注册",
      icon: markRaw(Edit),
      buttonType: "primary",
      operateType: "business",
      cb: () => {
        regist();
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

// 能力列表
const getAbilityList = () => {
  roleListApi(roleListQuery).then((res) => {
    if (res.records) {
      tableData.value = res.records;
      roleTotalNum.value = res.total;
    } else {
      tableData.value = [];
      ElMsgToast({
        type: "warning",
        message: "暂无能力~",
      });
    }
  });
};
// 搜索
const regist = () => {
  console.log("注册");
};

// 分页
const handleSizeChange = (val: number) => {
  roleListQuery.size = val;
  getAbilityList();
};
const handlePageChange = (val: number) => {
  roleListQuery.current = val;
  getAbilityList();
};
const initData = () => {
  getAbilityList();
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
