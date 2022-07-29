<template>
  <div>角色管理</div>
  <div class="role-container">
    <div class="header-bg-box">
      <div class="header-bar-demo">
        <el-header-action-bar :button-group="originData.buttonGroup">
        </el-header-action-bar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import {
  HeaderActionButtonGroupItem,
  ElMsgBox,
  ElMsgToast,
} from "@enn/ency-design";
import { refRoleApi } from "@/api/role";
const originData = reactive({
  buttonGroup: [
    {
      label: "添加角色",
      buttonType: "primary",
      operateType: "business",
      cb: () => {
        addRoleFn();
      },
    },
    {
      label: "删除",
      buttonType: "secondary",
      operateType: "business",
      cb: () => {
        deleteRoleFn();
      },
    },
  ] as HeaderActionButtonGroupItem[],
});

const addRoleFn = () => {
  console.log("新增角色");
};
// 删除成员
const deleteRoleFn = () => {
  ElMsgBox.confirm("你确定要移除用户么?", "移除成员", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let refData = {};
    await refRoleApi(refData);
    ElMsgToast({
      type: "success",
      message: "删除成功",
    });
  });
};
const initData = () => {
  console.log("init");
};
onMounted(() => {
  initData();
});
</script>

function relevanceMember() { throw new Error("Function not implemented."); }
