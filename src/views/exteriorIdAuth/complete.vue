<template>
  <div class="completeContainer">
    <div>
      <div class="title">外部身份源已绑定</div>
      <div class="completeText">
        <div class="paddingClass">
          <span>身份源类型 :</span>
          <span style="padding-left: 20px">LDAP</span>
        </div>
        <div class="paddingClass">
          <span>登陆模块名称 :</span>
          <span style="padding-left: 20px">保定账号登陆</span>
        </div>
        <div class="paddingClass">
          <span>默认登陆 :</span>
          <span style="padding-left: 20px">是</span>
        </div>
      </div>
      <el-button
        type="primary"
        style="width: 100px; height: 40px"
        @click="handleEdit"
        >编辑</el-button
      >
      <div class="deleteClass actionClass">
        <el-icon><negative-color /></el-icon>
        <span class="deleteText" @click="handleDelete">删除数据源</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NegativeColor } from "@enn/ency-design-icons";
import { ElIcon } from "@enn/ency-design";
import { ElMsgBox, ElMsgToast } from "@enn/ency-design";
import { deleteAuth } from "@/api/idAuth";
import { useRouter } from "vue-router";

const router = useRouter();
// 删除操作
const handleEdit = () => {
  router.push({
    path: "/stepIdAuth",
    query: {
      status: "isEdit",
    },
  });
};
const handleDelete = () => {
  ElMsgBox.confirm("身份源删除后不可恢复?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    buttonSize: "small",
  }).then(async () => {
    await deleteAuth();
    router.push({
      path: "/exteriorIdAuth",
    });
    ElMsgToast({
      type: "success",
      message: "删除成功",
    });
  });
};
</script>

<style scoped lang="less">
.completeContainer {
  padding: 20px;
  height: calc(100% - 40px);
  background: #fff;
  display: flex;
  justify-content: center;
  text-align: center;
  padding-top: 10%;
  .deleteText {
    position: relative;
    bottom: 2px;
    padding-left: 10px;
  }
  .completeText {
    text-align: left;
    padding-left: 40px;
    padding-bottom: 20px;
  }
  .title {
    padding-bottom: 30px;
    font-size: 30px;
  }
  .paddingClass {
    padding-bottom: 15px;
  }
  .deleteClass {
    padding-top: 40px;
  }
}
</style>
