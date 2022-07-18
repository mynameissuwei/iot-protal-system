<template>
  <el-two-column
    v-model:value="valueWidth"
    ref="twoColumnLayout"
    class="two-column-container"
    @close-detail="closeDetail"
    @full-screen="fullScreenEvent"
    @move-end="moveEnd"
    :show-full-screen="false"
    :show-close="false"
  >
    <template #left>
      <!-- <div class="two-column-left"> -->
      <div class="organ-tree">
        <el-title class="organ-tit" :level="4">组织管理</el-title>
        <el-input
          class="organ-input"
          v-model="filterText"
          placeholder="输入组织名称"
          ><template #suffix>
            <el-icon class="el-input__icon" @click="handleIconClick">
              <search />
            </el-icon> </template
        ></el-input>
        <el-tree
          ref="treeRef"
          class="filter-tree"
          :data="dataSource"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <a @click="append(data)">
                  <!-- <el-button text :icon="Edit"></el-button> -->
                  <el-icon :size="12" class="tit-editBtn"
                    ><add-number
                  /></el-icon>
                </a>
                <a @click="remove(node, data)">
                  <el-icon :size="12" class="tit-editBtn"><delete /></el-icon>
                </a>
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
              <span>{{ form.parentName }}</span>
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
      <!-- </div> -->
    </template>
    <template #right>
      <!-- <div class="two-column-right"> -->
      <div class="table-orgain">
        <h4 class="table-orgain-tit" v-if="updateName">
          {{ orgainName }}
          <el-button text :icon="Edit" @click="editOrganNameFn"></el-button>
        </h4>
        <h4 class="table-orgain-tit" v-if="!updateName">
          <el-input
            v-model="orgainName"
            placeholder="请输入名称"
            :suffix-icon="ScanQrCode"
          />
          <!-- <el-input></el-input> {{ orgainName }} -->
          <el-button
            text
            :icon="UploadSuccess"
            @click="saveOrganNameFn"
          ></el-button>
        </h4>
        <el-descriptions title="" class="table-orgain-des">
          <el-descriptions-item label="组织ID">{{
            orgMsg.deptName
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            orgMsg.time || "2022-07-01"
          }}</el-descriptions-item>
        </el-descriptions>
        <template>
          <div class="header-bg-box">
            <div class="header-bar-demo">
              <el-header-action-bar
                :title="'组织成员'"
                :button-group="originData.buttonGroup"
              >
              </el-header-action-bar>
            </div>
          </div>
        </template>
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="date" label="账号名" width="180" />
          <el-table-column prop="name" label="昵称" width="100" />
          <el-table-column prop="objectStatus" label="所属组织" />
          <el-table-column fixed="right" label="操作" width="120">
            <template #default>
              <el-link class="edit-link" :underline="false" @click="viewOrgan"
                >查看</el-link
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            class="flex justify-end mt-16px"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="prev, pager, next, jumper"
            :total="1000"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <el-dialog v-model="dialogConnectMemberVisible" title="关联组织成员">
          <el-combo-box
            v-model="connectValue"
            multiple
            remote
            reserve-keyword
            placeholder="输入昵称或账号名查找"
            :remote-method="remoteMethod"
            :loading="connectLoading"
          >
            <el-option
              v-for="item in connectOptions"
              :key="item.id"
              :label="item.account"
              :value="item.id"
            />
          </el-combo-box>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="connectMember">
                确定
              </el-button>
              <el-button @click="dialogConnectMemberVisible = false"
                >取消</el-button
              >
            </span>
          </template>
        </el-dialog>
      </div>
    </template>
  </el-two-column>
</template>

<script setup lang="ts">
import { watch, ref, reactive, markRaw, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  //   addOrgan,
  //   updateOrgan,
  //   removeOrgan,
  //   search,
  geQueryUserList,
  orgDetailMsg,
  organMemberList,
  organTree,
  addConnectMember,
} from "@/api/organ";
import {
  Edit,
  Delete,
  AddNumber,
  UploadSuccess,
  Search,
} from "@enn/ency-design-icons";
import {
  ElTree,
  ElInput,
  ElMsgBox,
  ElMsgToast,
  ElIcon,
  ElHeaderActionBar,
  ElSearchField,
  ElPagination,
} from "@enn/ency-design";
import type { HeaderActionButtonGroupItem } from "@enn/ency-design";

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

interface OptionData {
  id: string;
  account: string;
}

let orgMsg = {};
let id = 1000;
// 分页数据
const currentPage = ref(5);
const pageSize = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const valueWidth = ref(1 / 5);
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const dialogFormVisible = ref(false);
const updateName = ref(true);
const form = reactive({
  orgName: "",
  parentName: "",
});
const orgNameVal = ref("");
const orgainName = ref("北京燃气组织");

// 关联组织成员
const dialogConnectMemberVisible = ref(false);
const connectLoading = ref(false);
const connectValue = ref([]);
const connectOptions = ref<OptionData[]>([]);

const defaultProps = {
  children: "children",
  label: "label",
};
const initData = () => {
  let id = "1123598813738675201";
  organTree().then((res) => {
    console.log(res);
  });
  organMemberList(id).then((res) => {
    console.log(res);
  });
  orgDetailMsg(id).then((res) => {
    orgMsg = res.data;
  });
  orgMsg;
};
// 组织成员列表
const tableRowClassName = "``";
const tableData = [
  {
    date: "zhanghaoming1",
    name: "昵称1",
    objectStatus: "北京燃气公司",
  },
  {
    date: "zhanghaoming1",
    name: "昵称1",
    objectStatus: "北京燃气公司",
  },
  {
    date: "zhanghaoming1",
    name: "昵称1",
    objectStatus: "北京燃气公司",
  },
  {
    date: "zhanghaoming1",
    name: "昵称1",
    objectStatus: "北京燃气公司",
  },
];
const originData = reactive({
  buttonGroup: [
    {
      label: "关联组织成员",
      icon: markRaw(Edit),
      buttonType: "primary",
      operateType: "business",
      cb: () => {
        relevanceMember();
      },
    },
    {
      label: "删除",
      icon: markRaw(Delete),
      buttonType: "secondary",
      operateType: "business",
      cb: () => {
        deleteMember();
      },
    },
  ] as HeaderActionButtonGroupItem[],
});
let newData = reactive({
  newTree: [],
});

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
// 分页
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
// 查看成员详情
const viewOrgan = () => {
  alert("跳转详情页");
};
// 编辑组织名称
const editOrganNameFn = () => {
  updateName.value = false;
  console.log(updateName.value);
};
// 保存组织名称
const saveOrganNameFn = () => {
  ElMsgBox.confirm("是否保存修改的组织名称?", "确认", {
    confirmButtonText: "保存",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMsgToast({
        type: "success",
        message: "组织名称修改成功",
      });
      updateName.value = true;
    })
    .catch(() => {
      ElMsgToast({
        type: "info",
        message: "取消修改",
      });
    });
};
// 添加组织弹窗
const addOrgan = () => {
  console.log(222, newData.newTree);
  let newTreeData = newData.newTree;
  dialogFormVisible.value = false;
  console.log(333, form.orgName);
  orgNameVal.value = form.orgName || "默认组织";
  console.log(3331, orgNameVal.value);
  const newChild = { id: id++, label: orgNameVal.value, children: [] };
  if (!newTreeData.children) {
    newTreeData.children = [];
  }
  console.log(444, newChild);
  newTreeData.children.push(newChild);
  dataSource.value = [...dataSource.value];
  console.log(4441, newChild, newTreeData.children);
};
const dleOrgan = () => {
  dialogFormVisible.value = false;
};
const append = (data: Tree) => {
  console.log("111111", data);
  //   localStorage.setItem("newTree", data);
  newData.newTree = data;
  console.log(11112, newData.newTree);
  form.orgName = "";
  dialogFormVisible.value = true;
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
//删除成员
const deleteMember = () => {
  console.log("删除成员");
};
//关联组织成员
const relevanceMember = () => {
  dialogConnectMemberVisible.value = true;
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
//初始化关联用户列表数据
const getConnectUserData = (query = "") => {
  let page = { current: 1, size: 20 };
  geQueryUserList({ keyword: query, ...page }).then((res) => {
    connectLoading.value = false;
    connectOptions.value = res.records;
  });
};
const remoteMethod = (query: string) => {
  if (query) {
    connectLoading.value = true;
    getConnectUserData(query);
  }
};
//添加关联人员
const connectMember = () => {
  addConnectMember({
    orgId: "1123598813738675201",
    uidList: connectValue.value,
  }).then((res) => {
    dialogConnectMemberVisible.value = false;
    ElMsgToast({
      type: "success",
      message: "关联组织成员成功",
    });
    //需要刷新列表
  });
};

onMounted(() => {
  getConnectUserData();
  initData();
});
</script>

<style scoped lang="less">
.parent-name .el-input__inner {
  border: 0 !important;
}
.two-column-container {
  width: 100%;
  height: 500px;
  background-color: #f1f1f1;
  display: flex;
}
.two-column-left {
  width: 100%;
  height: 100%;
  text-align: left;
}
.two-column-right {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  a {
    margin: 0 11px;
  }
}
.table-orgain {
  //   margin-left: 20px;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 23px 15px 10px 15px;
  .pagination {
    margin: 16px 0;
  }
  .header-bg-box {
    height: 200px;
  }
  .table-orgain-tit {
    font-size: 18px;
    font-weight: 500;
    color: #343a40;
    line-height: 16px;
    .el-input {
      width: auto;
    }
    .tit-editBtn {
      margin: 0 13px;
      color: #4068d4;
      cursor: pointer;
    }
    .tit-editBtn:hover {
      background: #f2f3f5;
    }
    .tit-editBtn:active {
      background: #ebecf0;
    }
  }
  .table-orgain-des {
    margin: 19px 0 17px;
    .el-descriptions__cell {
      width: 300px !important;
    }
  }
}
.organ-tree {
  padding: 21px 11px 21px 16px;
  background: #fff;
  //   width: 290px;
  .organ-tit {
    font-size: 16px;
    font-weight: 500;
    color: #343a40;
    line-height: 22px;
  }
  .organ-input {
    margin: 21px 0;
  }
  .el-tree {
    // width: 260px;
  }
}
.tit-editBtn {
  //   margin: 0 13px;
  color: #4068d4;
  cursor: pointer;
}
</style>
