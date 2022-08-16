<template>
  <div class="completeContainer">
    <div>
      <div class="title">外部身份源已绑定</div>
      <div class="completeText">
        <el-row class="paddingClass">
          <el-col :span="10" class="leftClass">身份源类型 :</el-col>
          <el-col :span="14" class="centerClass">LDAP</el-col>
        </el-row>
        <el-row class="paddingClass">
          <el-col :span="10" class="leftClass">登陆模块名称 :</el-col>
          <el-col :span="14" class="centerClass">{{
            dataReiv.moduleName
          }}</el-col>
        </el-row>
        <el-row class="paddingClass">
          <el-col :span="10" class="leftClass">默认登陆 :</el-col>
          <el-col :span="14" class="centerClass">{{
            dataReiv.defaultLogin == "1" ? "否" : "是"
          }}</el-col>
        </el-row>
      </div>
      <el-button
        type="primary"
        style="width: 100px; height: 40px"
        @click="handleEdit"
        >编辑</el-button
      >
      <div class="deleteClass actionClass">
        <span class="deleteText" @click="handleDelete">删除数据源</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { ElMsgBox, ElMsgToast } from "@enn/ency-design";
import { deleteAuth } from "@/api/idAuth";
import { useRouter } from "vue-router";
import { getAuth } from "@/api/idAuth";

const router = useRouter();
const dataReiv = reactive({
  moduleName: "本地LD",
  defaultLogin: "1",
});
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

onMounted(() => {
  getAuth().then((res) => {
    Object.assign(dataReiv, res);
  });
});
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
    font-size: 35px;
  }
  .paddingClass {
    width: 300px;
    padding-bottom: 15px;
  }
  .deleteClass {
    padding-top: 40px;
  }
  .leftClass {
    text-align: right;
  }
  .centerClass {
    text-align: center;
  }
}
</style>
