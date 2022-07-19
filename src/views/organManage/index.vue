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
        <el-tree-v2
          class="treeStyle"
          ref="treeRef"
          :data="dataSource"
          :props="defaultProps"
          :default-expanded-keys="arrStar.books"
          :filter-method="filterMethod"
          :node-key="id"
          @node-click="clickNowNode"
          :height="500"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span class="actveapan">
                <a @click.stop="append(data)">
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
        </el-tree-v2>

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
          <el-button
            text
            :icon="UploadSuccess"
            @click="saveOrganNameFn"
          ></el-button>
        </h4>
        <el-descriptions title="" class="table-orgain-des">
          <el-descriptions-item label="组织ID">{{
            orgMsg.id || "1"
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            orgMsg.createTime || "2022-07-01"
          }}</el-descriptions-item>
        </el-descriptions>
        <!-- <template> -->
        <div class="header-bg-box">
          <div class="header-bar-demo">
            <el-header-action-bar
              :title="'组织成员'"
              :button-group="originData.buttonGroup"
            >
            </el-header-action-bar>
          </div>
        </div>
        <!-- </template> -->
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          highlight-current-row
          style="width: 100%; margin-top: 55px"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="account" label="账号名" width="180" />
          <el-table-column prop="name" label="昵称" width="100" />
          <el-table-column prop="orgs" label="所属组织" />
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-link
                class="edit-link"
                :underline="false"
                @click="viewOrgan(scope.row)"
                >查看</el-link
              >
            </template>
          </el-table-column>
          <template #empty>
            <el-msg-page>
              <template #icon>
                <img src="/images/no-search-result.svg" alt="" />
              </template>
              <template #subTitle>
                <div>组织下暂无成员</div>
              </template>
            </el-msg-page></template
          >
        </el-table>

        <div class="pagination">
          <el-pagination
            background
            layout="total,sizes, prev, pager, next, jumper"
            v-model:currentPage="listQuery.current"
            v-model:page-size="listQuery.size"
            :total="pageTotal"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          ></el-pagination>
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
            v-loading="listLoading"
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
import { ElTreeV2 } from "element-plus";
import type { TreeNode } from "element-plus/es/components/tree-v2/src/types";
import { useRouter } from "vue-router";
import {
  addOrganApi,
  updateOrgan,
  //   removeOrgan,
  //   search,
  refOrganMemberApi,
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

let id = 1000;
const router = useRouter();
// 分页数据
const listQuery = reactive({
  id: "1",
  current: 1,
  size: 10,
});
const pageTotal = ref(0);
const listLoading = ref(false);
// const currentPage = ref(5);
// const pageSize = ref(100);
// const small = ref(false);
const background = ref(false);
const disabled = ref(false);

let arrStar = reactive({ books: [] });
const valueWidth = ref(1 / 5);
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const dialogFormVisible = ref(false);
const updateName = ref(true);
let orgMsg = reactive({
  deptName: "",
  id: "",
  createTime: "",
});
const form = reactive({
  orgName: "",
  parentName: "",
  parentOrgId: "",
});
const orgNameVal = ref("");
const orgainName = ref("新奥集团");
const dataSource: Tree[] = ref([]);
const refOrganMemberList = ref([]);
// 关联组织成员
const dialogConnectMemberVisible = ref(false);
const connectLoading = ref(false);
const connectValue = ref([]);
const connectOptions = ref<OptionData[]>([]);

const defaultProps = {
  value: "id",
  label: "title",
  children: "children",
};
const initData = () => {
  getMemberList();
  orgDetailMsgFn();
  organTreeFn();
};
const organTreeFn = () => {
  organTree().then((res) => {
    dataSource.value = res;
    let arr = [];
    arr.push(res[0].id);
    arrStar.books = arr;
    console.log(10122, dataSource.value, arrStar.books);
  });
};
// 组织成员列表
const tableRowClassName = "``";
const tableData = ref([
  //   {
  //     account: "zhanghaoming1",
  //     name: "昵称1",
  //     orgs: "北京燃气公司",
  //   },
  //   {
  //     account: "zhanghaoming1",
  //     name: "昵称1",
  //     orgs: "北京燃气公司",
  //   },
  //   {
  //     account: "zhanghaoming1",
  //     name: "昵称1",
  //     orgs: "北京燃气公司",
  //   },
  //   {
  //     account: "zhanghaoming1",
  //     name: "昵称1",
  //     orgs: "北京燃气公司",
  //   },
]);
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
  console.log(77777, val);
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
// 分页
const handleSizeChange = (val: number) => {
  listQuery.size = val;
  getMemberList();
};
const handlePageChange = (val: number) => {
  listQuery.current = val;
  getMemberList();
};
// 查看成员详情
const viewOrgan = (data: { id: any }) => {
  console.log(788888, data);
  router.push({
    path: "/detail",
    query: {
      userId: data.id,
      type: "view",
    },
  });
  //   alert("跳转详情页");
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
      let data = {
        id: orgMsg.id,
        orgName: orgainName.value,
      };
      console.log(11100, data);
      updateOrgan(data).then((res) => {
        ElMsgToast({
          type: "success",
          message: "组织名称修改成功",
        });
        organTreeFn();
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
// 添加组织弹窗确认
const addOrgan = () => {
  let newTreeData = newData.newTree;
  dialogFormVisible.value = false;
  orgNameVal.value = form.orgName || "默认组织";
  let data = {
    parentOrgId: newTreeData?.id,
    orgName: form.orgName,
    parentName: form.parentName,
  };
  addOrganApi(data).then((res) => {
    console.log(666111, res);
    if (res) {
      ElMsgToast({
        message: "新增成功！",
      });
      organTreeFn();
    }
  });
};
const dleOrgan = () => {
  dialogFormVisible.value = false;
};
const append = (data: Tree) => {
  form.parentName = data.title;
  newData.newTree = data;
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
//删除组织成员
const deleteMember = () => {
  console.log("移除成员");
  ElMsgBox.confirm("你确定要移除用户么?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    buttonSize: "small",
  }).then(async () => {
    const result = refOrganMemberList.value.map((item) => item.id);
    const ids = result.join(",");
    await refOrganMemberApi({ ids });
    // await deleteList({ ids });
    // await getData();
    ElMsgToast({
      type: "success",
      message: "删除成功",
    });
  });
};
//删除多个组织成员
const handleSelectionChange = (val: never[]) => {
  console.log(77771, val);
  refOrganMemberList.value = val;
};
// 获取组织成员表格数据
const getMemberList = () => {
  listLoading.value = true;
  organMemberList(listQuery).then((res) => {
    console.log(777111, res);
    if (res.records) {
      tableData.value = res.records;
      pageTotal.value = res.total || 50;
      listLoading.value = false;
    } else {
      //   tableData.value = [];
      ElMsgToast({
        type: "warning",
        message: "当前组织下暂无组织成员~",
      });
    }
  });
};
// 获取组织详情
const orgDetailMsgFn = () => {
  orgDetailMsg(newData.newTree.id).then((res) => {
    orgMsg.value = res.data;
  });
};
// 点击当前节点
const clickNowNode = (data: TreeNode) => {
  console.log(data.id, "99");
  orgMsg.id = data.id;
  orgMsg.createTime = data.createTime;
  orgainName.value = data.title;
  listQuery.id = data.id;
  getMemberList();
};
//关联组织成员
const relevanceMember = () => {
  dialogConnectMemberVisible.value = true;
};
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
const filterMethod = (query: string, node: TreeNode) => {
  return node?.title?.includes(query);
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
  .actveapan {
    display: none;
  }
  &:hover {
    .actveapan {
      display: block;
    }
  }
}
.table-orgain {
  margin-left: 6px;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 23px 15px 10px 15px;
  .pagination {
    margin: 20px 0;
    display: flex;
    justify-content: right;
  }
  .header-bg-box {
    height: 200px;
    position: absolute;
    width: calc(100% - 20px);
    width: 100%;
    top: 100px;
    min-width: 200px;
    .header-bar-demo .el-header-action-bar {
      padding-left: 0;
    }
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
  .treeStyle .el-vl__wrapper .el-vl__window::-webkit-scrollbar {
    width: 0 !important;
  }
}
.tit-editBtn {
  //   margin: 0 13px;
  color: #4068d4;
  cursor: pointer;
}
</style>
