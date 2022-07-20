<template>
  <section class="detail-content">
    <div class="header">
      <div>{{ state.userInfo.realName }}</div>
      <el-button v-show="type !== 'edit'" type="secondary" @click="editInfo"
        >编辑</el-button
      >
    </div>
    <div class="info">
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="账户名">{{
          state.userInfo.account
        }}</el-descriptions-item>
        <el-descriptions-item label="昵称">
          <span v-show="type !== 'edit'">{{ state.formData.name }}</span>
          <el-input
            class="info-input"
            v-show="type === 'edit'"
            v-model="state.formData.name"
          ></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          <span v-show="type !== 'edit'">{{ state.formData.phone }}</span>
          <el-input
            class="info-input"
            maxlength="11"
            v-show="type === 'edit'"
            v-model="state.formData.phone"
            @blur="handleInput"
          ></el-input>
          <div class="errormsg" v-show="type === 'edit' && errormsg">
            {{ errormsg }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          state.userInfo.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="创建人">
          {{ state.userInfo.createUserName }}
        </el-descriptions-item>
        <el-descriptions-item label="账号状态">正常</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="org">
      <h1>组织信息</h1>
      <span class="title" v-show="type === 'edit'">所属组织：</span>

      <com-tree-select
        v-if="type === 'edit' && loading"
        :options="treeOptions"
        v-model="valueStrictly"
      />
      <!-- <el-tree-select
        node-key="id"
        v-show="type === 'edit'"
        v-model="valueStrictly"
        :props="defaultProps"
        multiple
        :data="treeOptions"
        filterable
        :render-after-expand="false"
        placeholder="请选择组织"
        show-checkbox
        collapse-tags
        collapse-tags-tooltip
        check-strictly
        check-on-click-node
      /> -->
      <div v-show="type !== 'edit'">
        <el-tag v-for="(item, index) in tagList" :key="index">{{
          item
        }}</el-tag>
      </div>
    </div>
    <div class="limit">
      <h1>权限信息</h1>
      <el-checkbox-group v-model="checkList" v-if="type === 'edit'">
        <el-checkbox v-for="item in options" :label="item.id" :key="item.id">{{
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
import {
  getUserDetail,
  getOrg,
  getRoletList,
  getOrgChildren,
  updateUser,
  getOrgTree,
} from "@/api";
import { ElFooterActionBar, ElMsgToast } from "@enn/ency-design";
import type { FooterActionButtonGroupItem } from "@enn/ency-design";
// import { ElTreeSelect } from "element-plus";
import comTreeSelect from "./components/treeSelect.vue";

interface Tree {
  deptName: string;
  parentName: string;
  parentId: string;
  id: string;
  hasChildren?: boolean;
}

interface Options {
  id: string;
  roleName: string;
}

const route = useRoute();
const router = useRouter();
const options = ref([] as Options[]);
const tagList = ref([]);
const roleList = ref([]);
const checkList = ref([]);
const treeOptions = ref([]);
const valueStrictly = ref();
const loading = ref(false);
const errormsg = ref("");
const type = ref(route.query.type);

// const defaultProps = {
//   label: "deptName",
//   isLeaf: function (data: any, node: any) {
//     return !data.hasChildren;
//   },
// };

const state = reactive({
  buttonGroup: [
    {
      label: "确定",
      buttonType: "primary",
      cb: () => {
        updateUserDetail();
      },
    },
    {
      label: "取消",
      buttonType: "secondary",
      cb: () => {
        state.formData.name = state.userInfo.name;
        state.formData.phone = state.userInfo.phone;
        type.value = "view";
      },
    },
  ] as FooterActionButtonGroupItem[],
  userInfo: {
    name: "",
    phone: "",
    realName: "",
    account: "",
    createTime: "",
    createUserName: "",
  },
  formData: {
    name: "",
    phone: "",
  },
});

onMounted(() => {
  initData();
});

const editInfo = () => {
  type.value = "edit";
};

const initData = () => {
  getOrgTree().then((res) => {
    treeOptions.value = res;
  });
  getUserInfo();
  getRoletList({ current: 1, size: 20 }).then((res) => {
    options.value = res.records;
  });
};
const getUserInfo = () => {
  loading.value = false;
  let id = route.query.userId;
  getUserDetail({ id }).then((res) => {
    state.userInfo = { ...res };
    state.formData.name = res.name;
    state.formData.phone = res.phone;
    tagList.value = res.deptName
      ? res.deptName.indexOf(",") > -1
        ? res.deptName.split(",")
        : [res.deptName]
      : [];
    valueStrictly.value = res.deptId
      ? res.deptId.indexOf(",") > -1
        ? res.deptId.split(",")
        : [res.deptId]
      : [];
    roleList.value = res.roleName
      ? res.roleName.indexOf(",") > -1
        ? res.roleName.split(",")
        : [res.roleName]
      : [];
    checkList.value = res.roleId
      ? res.roleId.indexOf(",") > -1
        ? res.roleId.split(",")
        : [res.roleId]
      : [];
    loading.value = true;
  });
};

const handleInput = (e: any) => {
  const reg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (reg.test(e.target.value)) {
    errormsg.value = "";
  } else {
    errormsg.value = "手机号格式不对";
  }
};

// const loadNode = (node: any, resolve: (data: Tree[]) => void) => {
//   if (node.level === 0) {
//     getOrg({}).then((res) => {
//       return resolve(res);
//     });
//   }
//   if (node.data.id) {
//     getOrgChildren({ pid: node.data.id }).then((res) => {
//       return resolve(res);
//     });
//   }
// };

//编辑用户信息
const updateUserDetail = () => {
  let data = {
    id: route.query.userId,
    account: state.userInfo.account,
    deptId: valueStrictly.value.join(),
    roleId: checkList.value.join(),
    ...state.formData,
  };
  updateUser(data).then((res) => {
    if (res) {
      ElMsgToast({
        message: "编辑成功！",
      });
      router.push({
        path: "/member",
      });
    }
  });
};
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
    & .errormsg {
      margin-left: 60px;
      color: #ee6b6b;
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
