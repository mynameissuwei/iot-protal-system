<template>
  <!-- <div>组织管理</div> -->
  <div>
    <el-input v-model="filterText" placeholder="Filter keyword" />

    <el-tree
      ref="treeRef"
      class="filter-tree"
      :data="dataSource"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a @click="append(data)">
              <el-icon><add-number /></el-icon>
              添加
            </a>
            <a @click="remove(node, data)"> 删除 </a>
          </span>
        </span>
      </template>
    </el-tree>
    <el-dialog v-model="dialogFormVisible" title="添加组织">
      <el-form :model="form">
        <el-form-item
          label="组织名称"
          :label-width="formLabelWidth"
          placeholder="最多20个字符"
        >
          <el-input v-model="form.orgName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级组织" :label-width="formLabelWidth">
          <el-input
            class="parent-name"
            v-model="form.parentName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addOrgan"> 确认 </el-button>
          <el-button @click="dleOrgan">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <div class="table-orgain">
    <h4>{{ orgainName }}</h4>
    <template>
      <el-descriptions :title="orgainName">
        <el-descriptions-item label="组织ID">徐博韦</el-descriptions-item>
        <el-descriptions-item label="创建时间">2022-07-01</el-descriptions-item>
      </el-descriptions>
    </template>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="date" label="账号名" width="180" />
      <el-table-column prop="name" label="昵称" width="100" />
      <el-table-column prop="objectStatus" label="所属组织" width="120" />
      <el-table-column fixed="right" label="操作">
        <template #default>
          <el-link class="edit-link" :underline="false" @click="handleEdit"
            >编辑</el-link
          >
          <el-link class="delete-link" :underline="false" @click="handleDelete"
            >删除</el-link
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive } from "vue";
import {
  ElTree,
  ElInput,
  ElMsgBox,
  ElMsgToast,
  ElIcon,
} from "@enn/ency-design";

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
let id = 1000;

const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const dialogFormVisible = ref(false);
const form = reactive({
  orgName: "",
  parentName: "",
});
const orgNameVal = ref("");
const orgainName = ref("北京燃气组织");

const defaultProps = {
  children: "children",
  label: "label",
};

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
// 添加组织弹窗
const formVisible = (data: Tree) => {
  dialogFormVisible.value = true;
};
const addOrgan = () => {
  console.log(1111);
  dialogFormVisible.value = false;
  console.log(form.orgName);
  orgNameVal.value = form.orgName;
  // append(a)
};
const dleOrgan = () => {
  dialogFormVisible.value = false;
};
const append = (data: Tree) => {
  dialogFormVisible.value = true;
  orgNameVal.value = form.orgName;
  console.log(orgNameVal.value);
  const newChild = { id: id++, label: orgNameVal.value, children: [] };
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  dataSource.value = [...dataSource.value];
  console.log(orgNameVal.value);
};
// 删除组织
const remove = (node: Node, data: Tree) => {
  ElMsgBox.confirm(
    "此操作将删除本组织节点下的所有子组织，是否继续?",
    "删除组织",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
      buttonSize: "small",
    }
  ).then(async () => {
    const parent = node.parent;
    const children: Tree[] = parent.data.children || parent.data;
    const index = children.findIndex((d) => d.id === data.id);
    children.splice(index, 1);
    dataSource.value = [...dataSource.value];
    ElMsgToast({
      type: "success",
      message: "删除成功",
    });
  });
};

const dataSource: Tree[] = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          {
            id: 9,
            label: "Level three 1-1-1",
          },
          {
            id: 10,
            label: "Level three 1-1-2",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      {
        id: 5,
        label: "Level two 2-1",
      },
      {
        id: 6,
        label: "Level two 2-2",
      },
    ],
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      {
        id: 7,
        label: "Level two 3-1",
      },
      {
        id: 8,
        label: "Level two 3-2",
      },
    ],
  },
];
</script>
<style scoped lang="less">
.parent-name .el-input__inner {
  border: 0 !important;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.table-orgain {
  margin-left: 20px;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 10px;
}
</style>
