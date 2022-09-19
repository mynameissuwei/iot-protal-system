<template>
  <div class="table-orgain">
    <div class="header-bg-box">
      <div class="header-bar-demo">
        <el-button class="header-btn" @click="registAbility()">注册</el-button>
        <el-button
          class="header-btn"
          @click="deleteAbility()"
          :disabled="!refAbilityList.length"
          >删除</el-button
        >
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
      <el-table-column prop="roleName" label="能力名称" width="200" />
      <el-table-column prop="tenantName" label="应用名称(参与者)" />
      <el-table-column prop="tenantName" label="功能包名称" />
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
import { roleListApi, removeAbility } from "@/api";
import { useRouter } from "vue-router";
import { PAGINATION_CONFIG } from "@/const";

const router = useRouter();
const roleForm = reactive({
  roleName: "",
  description: "",
  id: "",
});
const refAbilityList = ref([]);
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

// 能力列表 临时、接口未出
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
// 搜索 临时、接口未出
const registAbility = () => {
  router.push({
    path: "/ecologyAbility/register",
  });
};
const deleteAbility = () => {
  if (refAbilityList.value.length) {
    ElMsgBox.confirm("你确定要删除吗?", "删除角色", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      const result = refAbilityList.value.map((item) => item.id);
      let refData = {
        ids: result.join(","),
      };
      removeAbility(refData)
        .then(() => {
          ElMsgToast({
            type: "success",
            message: "删除成功",
          });
        })
        .finally(() => {
          getAbilityList();
        });
    });
  } else {
    ElMsgToast({
      type: "warning",
      message: "请勾选将要删除的角色~",
    });
  }
  console.log("删除能力");
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
  line-height: 46px;
  width: calc(100% - 20px);
  width: 100%;
  top: 100px;
  min-width: 200px;
  .header-bar-demo {
    position: absolute;
    right: 36px;
  }
}
.edit-link-view {
  display: inline-block;
  margin: 0 16px;
}
</style>
