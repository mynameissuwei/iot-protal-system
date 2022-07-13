<template>
  <section class="detail-content">
    <div class="header">张三</div>
    <div class="info">
      <el-descriptions title="基本信息" column="2">
        <el-descriptions-item label="账户名">liuqq</el-descriptions-item>
        <el-descriptions-item label="昵称">琼琼</el-descriptions-item>
        <el-descriptions-item label="手机号">177688888888</el-descriptions-item>
        <el-descriptions-item label="创建时间"
          >2010-02-01 18:00:00</el-descriptions-item
        >
        <el-descriptions-item label="创建人"> lifei </el-descriptions-item>
        <el-descriptions-item label="账号状体">正常</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="org">
      <h1>组织信息</h1>
      <span class="title" v-show="type === 'edit'">所属组织：</span>
      <el-tree-select
        v-show="type === 'edit'"
        v-model="valueStrictly"
        :data="data"
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
        <el-tag>北京组织部</el-tag>
        <el-tag style="margin-left: 10px"
          >北京组织部北京组织部北京组织部北京组织部北京组织部</el-tag
        >
        <el-tag style="margin-left: 10px">北京组织部</el-tag>
      </div>
    </div>
    <div class="limit">
      <h1>权限信息</h1>
      <el-checkbox-group v-model="checked" v-if="type === 'edit'">
        <el-checkbox :label="3">Option A</el-checkbox>
        <el-checkbox :label="6">Option B</el-checkbox>
        <el-checkbox :label="9">Option C</el-checkbox>
        <el-checkbox :label="3">Option A</el-checkbox>
        <el-checkbox :label="6">Option B</el-checkbox>
        <el-checkbox :label="9">Option C</el-checkbox>
        <el-checkbox :label="3">Option A</el-checkbox>
        <el-checkbox :label="6">Option B</el-checkbox>
        <el-checkbox :label="9">Option C</el-checkbox>
        <el-checkbox :label="3">Option A</el-checkbox>
        <el-checkbox :label="6">Option B</el-checkbox>
        <el-checkbox :label="9">Option C</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group v-model="checked" v-if="type !== 'edit'">
        <el-checkbox :label="3" checked readonly>Option A</el-checkbox>
        <el-checkbox :label="6" checked readonly>Option B</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="operate" v-if="type === 'edit'">
      <el-footer-action-bar :button-group="state.buttonGroup">
      </el-footer-action-bar>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElFooterActionBar } from "@enn/ency-design";
import type { FooterActionButtonGroupItem } from "@enn/ency-design";
import { ElTreeSelect } from "element-plus";
// import OrgSelect from "./components/orgSelect";

const type = ref("edit");

const valueStrictly = ref();

const data = [
  {
    value: "1",
    label: "Level one 1",
    children: [
      {
        value: "1-1",
        label: "Level two 1-1",
        children: [
          {
            value: "1-1-1",
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    value: "2",
    label: "Level one 2",
    children: [
      {
        value: "2-1",
        label: "Level two 2-1",
        children: [
          {
            value: "2-1-1",
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        value: "2-2",
        label: "Level two 2-2",
        children: [
          {
            value: "2-2-1",
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
  {
    value: "3",
    label: "Level one 3",
    children: [
      {
        value: "3-1",
        label: "Level two 3-1",
        children: [
          {
            value: "3-1-1",
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        value: "3-2",
        label: "Level two 3-2",
        children: [
          {
            value: "3-2-1",
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];

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
      },
    },
  ] as FooterActionButtonGroupItem[],
});
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
    width: calc(100% + 40px);
    margin-top: -20px;
    margin-left: -20px;
    padding-left: 32px;
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
    :deep(.el-tag.el-tag--info) {
      background: #f2f3f5;
      color: #323233;
      margin-right: 4px;
    }
    :deep(.el-tag.el-tag--info:hover) {
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
    margin-right: 100px;
  }
}
</style>
