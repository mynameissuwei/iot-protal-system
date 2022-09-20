<template>
  <section class="detail-content">
    <div class="header">
      <div>{{ state.userInfo.account }}</div>
      <el-button v-show="type !== 'edit'" type="secondary" @click="editInfo"
        >编辑</el-button
      >
    </div>
    <div class="info">
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="账户名:">{{
          state.userInfo.account
        }}</el-descriptions-item>
        <el-descriptions-item label="昵称:">
          <span v-show="type !== 'edit'">{{ state.formData.name }}</span>
          <el-input
            class="info-input"
            maxlength="20"
            v-show="type === 'edit'"
            v-model="state.formData.name"
            @input="(value:string) => handleInputCheck('name', value)"
          ></el-input>
          <div class="errormsg" v-show="type === 'edit' && errorname">
            {{ errorname }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="手机号:" label-class-name="info-label">
          <span v-show="type !== 'edit'">{{ state.formData.phone }}</span>
          <el-input
            class="info-input"
            maxlength="11"
            v-show="type === 'edit'"
            v-model="state.formData.phone"
            @input="(value:string) => handleInputCheck('phone', value)"
          ></el-input>
          <div class="errormsg" v-show="type === 'edit' && errormsg">
            {{ errormsg }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间:">{{
          state.userInfo.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="创建人:">
          {{ state.userInfo.createUserName }}
        </el-descriptions-item>
        <el-descriptions-item label="账号状态:">正常</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="org">
      <h1>组织信息</h1>
      <span class="title" v-show="type === 'edit'">所属组织：</span>

      <com-tree-select
        v-if="type === 'edit' && loading"
        :options="treeOptions"
        v-model="valueStrictly"
        :checkNames="tagList"
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
      <div v-show="type !== 'edit' && tagList && tagList.length > 0">
        <el-tag v-for="(item, index) in tagList" :key="index">{{
          item
        }}</el-tag>
      </div>
      <div
        class="nodata"
        v-show="type !== 'edit' && tagList && tagList.length === 0"
      >
        暂无数据
      </div>
    </div>
    <div class="limit">
      <h1>角色信息</h1>
      <el-checkbox-group v-model="checkList" v-show="type === 'edit'">
        <el-checkbox v-for="item in options" :label="item.id" :key="item.id">{{
          item.roleName
        }}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group
        v-show="type !== 'edit' && roleList && roleList.length > 0"
      >
        <el-checkbox
          v-for="(item, index) in roleList"
          :key="index"
          :label="item"
          checked
          readonly
        ></el-checkbox>
      </el-checkbox-group>
      <div v-show="type !== 'edit' && roleList && roleList.length === 0">
        <el-empty :image-size="100"></el-empty>
      </div>
      <div class="operate" v-if="type === 'edit'">
        <el-footer-action-bar :button-group="state.buttonGroup">
        </el-footer-action-bar>
      </div>
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
import { phonePattern, namePattern } from "@/utils/pattern";
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
const tagList = ref();
const roleList = ref([]);
const checkList = ref([]);
const treeOptions = ref([]);
const valueStrictly = ref();
const loading = ref(false);
const errormsg = ref("");
const errorname = ref("");
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
      label: "保存",
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
  getRoletList({ tenantId: route.query.tenantId, current: 1, size: 50 }).then(
    (res) => {
      options.value = res.records;
    }
  );
};
const getUserInfo = () => {
  loading.value = false;
  let id = route.query.userId;
  getUserDetail({ id }).then((res) => {
    state.userInfo = { ...res };
    state.formData.name = res.name;
    state.formData.phone = res.phone;
    tagList.value = res.deptName ? res.deptName.split(",") : [];
    valueStrictly.value = res.deptId ? res.deptId.split(",") : [];
    roleList.value = res.roleName ? res.roleName.split(",") : [];
    checkList.value = res.roleId ? res.roleId.split(",") : [];
    loading.value = true;
  });
};

const handleInputCheck = (type: string, value: string) => {
  const pattern = type === "name" ? namePattern : phonePattern;
  if (
    pattern.test(value) ||
    (type === "phone" && (value === "" || typeof value === "undefined"))
  ) {
    if (type === "name") {
      errorname.value = "";
    } else {
      errormsg.value = "";
    }
    return true;
  } else {
    if (type === "name") {
      errorname.value = "只能包含中英文字符、数字、下划线";
    } else {
      errormsg.value = "手机号格式不对";
    }
    return false;
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
  let p1 = handleInputCheck("name", state.formData.name);
  let p2 = handleInputCheck("phone", state.formData.phone);
  Promise.all([p1, p2])
    .then((values) => {
      if (values[0] && values[1]) {
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
      }
    })
    .catch((error) => {
      console.log("error==>", error);
    });
};
</script>
<style scoped lang="less">
.detail-content {
  // position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
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
    position: relative;
    flex: 1;
    padding-bottom: 80px;
  }
  & .info {
    height: 200px;
    & .info-input {
      width: 230px;
      display: inline-block;
    }
    & .errormsg {
      margin-left: 76px;
      color: #ee6b6b;
    }
    :deep(.el-descriptions__label) {
      display: inline-block;
      width: 60px;
    }
  }
  .org {
    height: 130px;
    & .nodata {
      font-size: 14px;
      color: #969799;
      text-align: center;
    }
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
