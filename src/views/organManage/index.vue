<template>
  <el-two-column
    v-model:value="valueWidth"
    ref="twoColumnLayout"
    class="two-column-container"
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
            <el-icon class="el-input__icon">
              <search />
            </el-icon> </template
        ></el-input>
        <el-tree-v2
          :height="treeHeight"
          v-loading="treeLoading"
          class="treeStyle"
          ref="treeRef"
          :data="dataSource"
          :props="defaultProps"
          :default-expanded-keys="arrStar"
          :filter-method="filterMethod"
          @node-click="clickNowNode"
          :loading="treeLoading"
          empty-text="无搜索结果"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span class="actveapan">
                <a @click.stop="append(data)">
                  <!-- <el-icon :size="12" class="tit-editBtn"
                    ><add-number
                  /></el-icon> -->
                  <!-- <el-icon><addNumber /></el-icon> -->
                  <el-button text :icon="AddNumber"></el-button>
                </a>
                <a @click.stop="removeOrganFn(node, data)">
                  <el-button text :icon="Delete"></el-button>
                </a>
              </span>
            </span>
          </template>
        </el-tree-v2>

        <el-dialog v-model="dialogFormVisible" title="添加组织">
          <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item label="组织名称" label-width="100px" prop="orgName">
              <el-input
                v-model="form.orgName"
                autocomplete="off"
                placeholder="最多50个字符"
              ></el-input>
            </el-form-item>
            <el-form-item label="上级组织" label-width="100px">
              <span>{{ form.parentName }}</span>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="addOrgan(ruleFormRef)">
                确认
              </el-button>
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
        <h4 class="table-orgain-tit" v-if="isUpdateName">
          {{ orgainName }}
          <el-button text :icon="Edit" @click="editOrganNameFn"></el-button>
        </h4>
        <h4 class="table-orgain-tit" v-if="!isUpdateName">
          <el-input
            ref="refInput"
            v-model="orgainName"
            placeholder="请输入名称(最多50个字符)"
            @blur="orgainNameBlur()"
          />
          <el-button
            text
            :icon="UploadSuccess"
            @click="saveOrganNameFn"
          ></el-button>
        </h4>
        <el-descriptions title="" class="table-orgain-des">
          <el-descriptions-item label="组织ID :">{{
            orgMsg.id || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间 :">{{
            orgMsg.createTime || "--"
          }}</el-descriptions-item>
        </el-descriptions>
        <!-- <template> -->
        <div class="header-bg-box">
          <div class="header-bar-demo">
            <el-header-action-bar
              :title="actionBarTit.actionBarTitVlu"
              :button-group="originData.buttonGroup"
            >
              <span class="actionBar-tit">{{
                actionBarTit.actionBarTitVlu
              }}</span>
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
          <el-table-column prop="name" label="昵称" width="150" />
          <el-table-column prop="orgs" label="所属组织">
            <template #default="scope">
              <el-tag
                v-for="(item, index) in scope.row.orgs"
                :key="item.name"
                class="mx-1 tagStyle"
                :class="'tagColor' + index"
                effect="dark"
              >
                {{ item.name }}
              </el-tag>
            </template>
          </el-table-column>
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
            :layout="PAGINATION_CONFIG"
            v-model:currentPage="listQuery.current"
            v-model:page-size="listQuery.size"
            :total="pageTotal"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </div>

        <el-dialog
          :width="600"
          v-model="dialogConnectMemberVisible"
          title="关联组织成员"
          custom-class="connectSelect"
        >
          <p class="conect-title">选择关联成员:</p>
          <el-combo-box
            v-model="connectValue"
            multiple
            remote
            reserve-keyword
            placeholder="输入昵称或账号名查找"
            :remote-method="remoteMethod"
            :loading="connectLoading"
            style="width: 420px"
          >
            <el-option
              v-for="item in connectOptions"
              :key="item.id"
              :label="`${item.account}(${item.name ? item.name : '无昵称'})`"
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
import {
  watch,
  ref,
  reactive,
  markRaw,
  onMounted,
  onBeforeMount,
  nextTick,
} from "vue";
import { ElTreeV2 } from "element-plus";
import type { TreeNode } from "element-plus/es/components/tree-v2/src/types";
import { useRouter } from "vue-router";
import { PAGINATION_CONFIG } from "@/const";
import {
  addOrganApi,
  updateOrgan,
  removeOrgan,
  refOrganMemberApi,
  geQueryUserList,
  //   orgDetailMsg,
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
  ElPagination,
  ElTag,
  HeaderActionButtonGroupItem,
} from "@enn/ency-design";

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

interface OptionData {
  id: string;
  account: string;
  name: string;
}

// let id = 1000;
const router = useRouter();
// 分页数据
const listQuery = reactive({
  id: "1",
  current: 1,
  size: 10,
});
const pageTotal = ref(0);
// const actionBarTit = ref(`组织成员(${pageTotal.value})`);
const actionBarTit = reactive({
  actionBarTitVlu: "",
});
const listLoading = ref(false);

const refInput = ref();
const arrStar = ref([]);
const valueWidth = ref(1 / 5);
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const dialogFormVisible = ref(false);
const isUpdateName = ref(true);
const orgMsg = reactive({
  deptName: "",
  id: "1",
  createTime: "2022-07-18",
});
const form = reactive({
  orgName: "",
  parentName: "",
  parentOrgId: "",
});
const orgNameVal = ref("");
const orgainName = ref("新奥集团");
const dataSource = ref<Tree[]>([]);
const refOrganMemberList = ref([]);
// 关联组织成员
const dialogConnectMemberVisible = ref(false);
const connectLoading = ref(false);
const treeLoading = ref(false);
let connectValue = ref([]);
const connectOptions = ref<OptionData[]>([]);
const treeHeight = ref(0);
// 组织成员列表
const tableRowClassName = "``";
const tableData = ref([]);
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
      label: "移除成员",
      icon: markRaw(Delete),
      buttonType: "secondary",
      operateType: "business",
      cb: () => {
        deleteMember();
      },
    },
  ] as HeaderActionButtonGroupItem[],
});
const newData = reactive({
  newTree: [],
});
const defaultProps = {
  value: "id",
  label: "title",
  children: "children",
};
const buttonLoadingRef = ref(false);
const ruleFormRef = ref();
const rules = reactive({
  orgName: [
    { required: true, message: "请输入组织名", trigger: "change" },
    { min: 1, max: 50, message: "请输入1到50位", trigger: "change" },
  ],
});

// method
const initData = () => {
  getMemberList();
  //   orgDetailMsgFn();
  organTreeFn();
  getConnectUserData();
};
const organTreeFn = () => {
  treeLoading.value = true;
  organTree().then((res) => {
    dataSource.value = res;
    let arr = [];
    arr.push(res[0].id);
    arrStar.value = arr;
    treeLoading.value = false;
    // console.log(10122, dataSource.value, arrStar.value);
  });
};

watch(filterText, (val) => {
  treeRef.value.filter(val);
});

// const filterNode = (value: string, data: Tree) => {
//   if (!value) return true;
//   return data.label.includes(value);
// };
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
const viewOrgan = (data: { id: string; tenantId: string }) => {
  router.push({
    path: "/detail",
    query: {
      userId: data.id,
      type: "view",
      tenantId: data.tenantId,
    },
  });
};
// 编辑组织名称
const editOrganNameFn = () => {
  isUpdateName.value = false;
  nextTick(() => {
    console.log("进入");
    refInput.value.focus();
  });
};
const orgainNameBlur = () => {
  isUpdateName.value = true;
  saveOrganNameFn();
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
      updateOrgan(data).then(() => {
        ElMsgToast({
          type: "success",
          message: "组织名称修改成功",
        });
        organTreeFn();
      });

      isUpdateName.value = true;
    })
    .catch(() => {
      ElMsgToast({
        type: "info",
        message: "取消修改",
      });
    });
};
// 添加组织弹窗确认

const addOrgan = async (formEl) => {
  buttonLoadingRef.value = true;
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      buttonLoadingRef.value = false;
      let newTreeData = newData.newTree;
      dialogFormVisible.value = false;
      orgNameVal.value = form.orgName || "默认组织";
      let data = {
        parentOrgId: newTreeData?.id,
        orgName: form.orgName,
        parentName: form.parentName,
      };
      addOrganApi(data).then((res) => {
        if (res) {
          ElMsgToast({
            message: "新增成功！",
          });
          organTreeFn();
        }
      });
    } else {
      console.log("error submit!", fields);
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
const removeOrganFn = (node: Node, data: Tree) => {
  ElMsgBox.confirm("删除后此操作不可恢复，是否继续？", "删除组织", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    buttonSize: "small",
  }).then(async () => {
    if (node.parent) {
      const parent = node.parent;
      const children: Tree[] = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      dataSource.value = [...dataSource.value];
      await removeOrgan(data.id);
      ElMsgToast({
        type: "success",
        message: "删除成功",
      });
      organTreeFn();
    } else {
      ElMsgToast({
        type: "warning",
        message: "当前组织为根组织节点，不可删除~",
      });
    }
  });
};
//删除组织成员
const deleteMember = () => {
  ElMsgBox.confirm("你确定要移除用户么?", "移除成员", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    buttonSize: "small",
  }).then(async () => {
    const result = refOrganMemberList.value.map((item) => item.id);
    // const result = result.join(",");
    let refData = {
      //   uids: JSON.stringify(result),
      uids: result,
      orgId: orgMsg.id,
    };
    await refOrganMemberApi(refData);
    ElMsgToast({
      type: "success",
      message: "删除成功",
    });
    getMemberList();
  });
};
//删除多个组织成员
const handleSelectionChange = (val: never[]) => {
  refOrganMemberList.value = val;
};
// 获取组织成员表格数据
const getMemberList = () => {
  listLoading.value = true;
  // const params = listQuery.value;
  organMemberList(listQuery).then((res) => {
    if (res.records) {
      tableData.value = res.records;
      pageTotal.value = res.total || 0;
      actionBarTit.actionBarTitVlu = `组织成员(${pageTotal.value})`;
      //   console.log(111111, actionBarTit.actionBarTitVlu);
      listLoading.value = false;
    } else {
      tableData.value = [];
      ElMsgToast({
        type: "warning",
        message: "当前组织下暂无组织成员~",
      });
    }
  });
};
// 获取组织详情
// const orgDetailMsgFn = () => {
//   orgDetailMsg(newData.newTree.id).then((res) => {
//     orgMsg.value = res.data;
//   });
// };

// 点击当前节点
const clickNowNode = (data: {
  id: string;
  createTime: string;
  title: string;
}) => {
  orgMsg.id = data.id;
  orgMsg.createTime = data.createTime;
  orgainName.value = data.title;
  listQuery.id = data.id;
  getMemberList();
};
//关联组织成员
const relevanceMember = () => {
  dialogConnectMemberVisible.value = true;
  connectValue.value = [];
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
    orgId: orgMsg.id,
    uidList: connectValue.value,
  }).then(() => {
    dialogConnectMemberVisible.value = false;
    ElMsgToast({
      type: "success",
      message: "关联组织成员成功",
    });
    //需要刷新列表
    getMemberList();
  });
};
const filterMethod = (query: string, node: TreeNode) => {
  return node?.title?.includes(query);
};
onBeforeMount(() => {
  const screenHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  treeHeight.value = screenHeight - 280;
});
onMounted(() => {
  initData();
});
</script>

<style scoped lang="less">
.parent-name .el-input__inner {
  border: 0 !important;
}
.two-column-container {
  width: 100%;
  height: 100% !important;
  background-color: #f1f1f1;
  display: flex;
  /deep/.el-two-column__horizontal .el-two-column__right-pane {
    background: #fff;
  }
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
    // margin: 0 11px;
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
  padding: 23px 16px 10px 16px;
  .tagStyle {
    margin: 0 2px;
  }
  .tagColor0 {
    background: #e6ecff;
    color: #3455ad;
  }
  .tagColor1 {
    background: #e1f5e7;
    color: #3ea35c;
  }
  .tagColor2 {
    background: #f3eafe;
    color: #7a4db8;
  }
  .tagColor3 {
    background: #fff2eb;
    color: #cc7846;
  }
  .tagColor4 {
    background: #ebf9ff;
    color: #318db8;
  }
  .tagColor5 {
    background: #fff8db;
    color: #d8b422;
  }
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
      padding: 0 33px;
      padding-left: 0;
      position: relative;
      .actionBar-tit {
        position: absolute;
        top: 10px;
        font-size: 16px;
        font-weight: 400;
        color: #323233;
      }
    }
  }
  .table-orgain-tit {
    font-size: 18px;
    font-weight: 600;
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
    height: 100%;
    .el-descriptions__cell {
      width: 300px !important;
    }
  }
}
.organ-tree {
  padding: 21px 11px 21px 16px;
  background: #fff;
  margin-right: 6px;
  height: 100% !important;
  overflow: hidden;
  .organ-tit {
    font-size: 18px;
    font-weight: 600;
    color: #343a40;
    line-height: 22px;
  }
  .organ-input {
    margin: 21px 0;
  }
  .el-tree {
    // width: 260px;
  }
  .treeStyle {
    height: 100%;
  }
  /deep/.treeStyle .el-vl__wrapper .el-vl__window {
    height: calc(100% -20px) !important;
    height: 700px !important;
    min-height: 400px !important;
    overflow-y: scroll;
  }
  /deep/.treeStyle .el-vl__wrapper .el-vl__window::-webkit-scrollbar {
    width: 0;
  }
  /deep/.treeStyle .el-vl__wrapper .el-virtual-scrollbar {
    position: absolute;
    right: -10px !important;
  }
}

:deep(.el-dialog.connectSelect .el-select__input) {
  height: 40px !important;
}
.tit-editBtn {
  //   margin: 0 13px;
  color: #4068d4;
  cursor: pointer;
}
.conect-title {
  display: inline-block;
  margin-right: 12px;
}
</style>
<style lang="less">
.table-orgain {
  margin-left: 6px;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 23px 16px 10px 16px;
}
.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: right;
}
</style>
