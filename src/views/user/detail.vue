<template>
  <section class="detail-content">
    <div class="header">
      <div>张三</div>
      <el-button type="secondary" @click="editInfo">编辑</el-button>
    </div>
    <div class="info">
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="账户名">{{
          state.userInfo.account
        }}</el-descriptions-item>
        <el-descriptions-item label="昵称">
          <span v-show="type !== 'edit'">{{ state.userInfo.account }}</span>
          <el-input class="info-input" v-show="type === 'edit'"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          <span v-show="type !== 'edit'">{{ state.userInfo.phone }}</span>
          <el-input class="info-input" v-show="type === 'edit'"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          state.userInfo.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="创建人">
          {{ state.userInfo.createUserName }}
        </el-descriptions-item>
        <el-descriptions-item label="账号状体">正常</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="org">
      <h1>组织信息</h1>
      <span class="title" v-show="type === 'edit'">所属组织：</span>
      <el-tree-select
        v-show="type === 'edit'"
        v-model="valueStrictly"
        :data="treeData"
        multiple
        :render-after-expand="false"
        placeholder="请选择组织"
        show-checkbox
        collapse-tags
        collapse-tags-tooltip
        check-strictly
        check-on-click-node
      />
      <div v-show="type !== 'edit'">
        <el-tag v-for="(item, index) in tagList" :key="index">{{
          item
        }}</el-tag>
      </div>
    </div>
    <div class="limit">
      <h1>权限信息</h1>
      <el-checkbox-group v-model="checked" v-if="type === 'edit'">
        <el-checkbox v-for="item in options" :label="item" :key="item.id">{{
          item.roleName
        }}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group v-if="type !== 'edit'">
        <el-checkbox
          v-for="(item, index) in roleList"
          :key="index"
          :label="item"
          checked
          readonly
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="operate" v-if="type === 'edit'">
      <el-footer-action-bar :button-group="state.buttonGroup">
      </el-footer-action-bar>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getUserDetail, getDepartTree, getRoletList } from "@/api";
import { ElFooterActionBar } from "@enn/ency-design";
import type { FooterActionButtonGroupItem } from "@enn/ency-design";
import { ElTreeSelect } from "element-plus";

const type = ref("view");

const options = ref([]);

const tagList = ref([]);

const roleList = ref([]);

const valueStrictly = ref();

// const data = [
//   {
//     value: "1",
//     label: "Level one 1",
//     children: [
//       {
//         value: "1-1",
//         label: "Level two 1-1",
//         children: [
//           {
//             value: "1-1-1",
//             label: "Level three 1-1-1",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     value: "2",
//     label: "Level one 2",
//     children: [
//       {
//         value: "2-1",
//         label: "Level two 2-1",
//         children: [
//           {
//             value: "2-1-1",
//             label: "Level three 2-1-1",
//           },
//         ],
//       },
//       {
//         value: "2-2",
//         label: "Level two 2-2",
//         children: [
//           {
//             value: "2-2-1",
//             label: "Level three 2-2-1",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     value: "3",
//     label: "Level one 3",
//     children: [
//       {
//         value: "3-1",
//         label: "Level two 3-1",
//         children: [
//           {
//             value: "3-1-1",
//             label: "Level three 3-1-1",
//           },
//         ],
//       },
//       {
//         value: "3-2",
//         label: "Level two 3-2",
//         children: [
//           {
//             value: "3-2-1",
//             label: "Level three 3-2-1",
//           },
//         ],
//       },
//     ],
//   },
// ];

const treeData = ref([]);

const checked = ref([]);
const state = reactive({
  buttonGroup: [
    {
      label: "确定",
      buttonType: "primary",
      cb: () => {
        alert("确定");
      },
    },
    {
      label: "取消",
      buttonType: "secondary",
      cb: () => {
        alert("取消");
        type.value = "view";
      },
    },
  ] as FooterActionButtonGroupItem[],
  userInfo: {},
});

onMounted(() => {
  console.log(111);
  initData();
});

// const filterMethod = (value) => {
//   treeData.value = [...data].filter((item) => item.label.includes(value));
// };

const editInfo = () => {
  type.value = "edit";
  //editData();
};

const initData = () => {
  //"1123598821738675201"1471793838262865921
  getUserDetail({ id: "1123598821738675201" }).then((res) => {
    console.log(res);
    state.userInfo = res;
    console.log(state.userInfo);
    tagList.value = res.deptName
      ? res.deptName.indexOf(",") > -1
        ? res.deptName.split(",")
        : [res.deptName]
      : [];
    roleList.value = res.roleName
      ? res.roleName.indexOf(",") > -1
        ? res.roleName.split(",")
        : [res.roleName]
      : [];
  });
  getRoletList({ current: 1, size: 20 }).then((res) => {
    console.log(res);
    options.value = res.records;
  });
  getDepartTree({}).then((res) => {
    console.log(res);
    treeData.value = res;
  });
};

// const editData = () => {};
</script>
<style lang="less">
//只针对于elementplus树选择的样式，无污染;后续ency有树选择组建后，可删除此代码
.el-tree-select__popper
  .el-select-dropdown.is-multiple
  .el-select-dropdown__item.selected:hover {
  background: transparent;
}
.el-tree-select__popper
  .el-select-dropdown.is-multiple
  .el-select-dropdown__item.selected {
  background: transparent;
}
.el-tree-select__popper .el-select-dropdown__item.hover {
  background: transparent;
}
.el-tree-select__popper .el-popper__arrow {
  display: none;
}
</style>
<style scoped lang="less">
.detail-content {
  //   position: relative;
  // height: calc(100%-40px);
  width: 100%;
  & .header {
    display: flex;
    justify-content: space-between;
    width: calc(100% + 40px);
    margin-top: -20px;
    margin-left: -20px;
    padding: 0 32px;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    font-weight: 500;
    color: #323233;
    background: #ffffff;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.04),
      inset 0px -1px 0px 0px rgba(0, 0, 0, 0.08);
  }
  & .info,
  & .org,
  & .limit {
    margin-top: 16px;
    background: #fff;
    padding: 24px;
  }
  & .limit {
    height: calc(100% - 110px);
  }
  & .info {
    & .info-input {
      width: 230px;
      display: inline-block;
    }
  }
  .org {
    & .title {
      margin-left: 10%;
      font-size: 14px;
      font-weight: 400;
      color: #646566;
    }

    :deep(.el-select) {
      width: 320px;
    }
    :deep(.el-input__wrapper) {
      width: 320px;
    }
    :deep(.el-select__tags) {
      top: 2px;
    }
    :deep(.el-tag) {
      background: #f2f3f5;
      color: #323233;
      margin-right: 4px;
    }
    :deep(.el-tag:hover) {
      background-color: #dcdfe6;
    }

    :deep(.el-tag__close) {
      color: #323233;
    }
    :deep(.el-tag .el-tag__close:hover) {
      background: transparent;
    }
  }
  h1 {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 16px;
  }
  :deep(.el-descriptions__body) {
    margin-left: 10%;
  }
  :deep(.el-checkbox) {
    width: 200px;
    margin-right: 50px;
  }
}
</style>
