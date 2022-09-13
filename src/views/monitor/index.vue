<template>
  <div class="monitor">
    <div class="monitor-header">
      <div class="monitor-header-wrapper">
        <div class="monitor-header-title">实时监控</div>
        <div class="monitor-header-content">
          通过产品、GIS、HT监控视图，从数据、地理位置、生产流程等多视角，实时监控产品和设备的最新状态
        </div>
      </div>
    </div>
    <div class="monitor-content">
      <div class="action-container">
        <el-table-action-bar
          :left-config="normalLeftConfig"
          :right-config="rightConfig"
          :input-config="inputConfig"
          @right-action-click="clickRightAction"
        />
      </div>
      <a-list
        :grid="{ gutter: 16, column: 4 }"
        :data-source="data"
        class="monitor-content-list"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <el-card class="box-card">
              <el-icon :size="40">
                <drag-border />
              </el-icon>
              <div>
                {{ item.title }}
              </div>
              <div>
                <span>testuser2</span>
                <el-divider direction="vertical"></el-divider>
                <span>2022-09-08 17:26:25</span>
              </div>
            </el-card>
          </a-list-item>
        </template>
      </a-list>

      <el-dialog v-model="dialogFormVisible" title="新建监控">
        <el-form :model="form" label-position="vertical">
          <el-form-item label="监控名称" placeholder="请输入促销名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="报表类型" placeholder="请输入促销名称">
            <div
              class="monitor-type"
              v-for="item in monitorType"
              :key="item.id"
            >
              <div class="monitor-type-title">{{ item.title }}</div>
              <div class="monitor-type-content">
                {{ item.content }}
              </div>
            </div>
          </el-form-item>
          <el-form-item label="部署位置">
            <el-select
              v-model="form.region"
              placeholder="请选择区域"
              style="width: 100%"
            >
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
              <el-option label="杭州" value="hangzhou"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible = false">
              确定
            </el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import List from "ant-design-vue/lib/list"; // 加载 JS
import "ant-design-vue/lib/list/style/css"; // 加载 CSS
import { DragBorder } from "@enn/ency-design-icons";
import { ElIcon } from "@enn/ency-design";

const monitorType = [
  {
    title: "GIS视图监控",
    content: "绘制设备地图，可视化监控各设备的实时状态。",
    id: 0,
  },
  {
    title: "产品监控",
    content: "监控单个产品下，各设备的实时数据",
    id: 1,
  },
  {
    title: "HT视图监控",
    content: "绘制厂区全景图，可视化监控各设备的实时状态",
    id: 2,
  },
];

const dialogFormVisible = ref(false);
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
const normalLeftConfig = reactive({
  leftActions: "全部",
});

const inputConfig = reactive({
  placeholder: "请输入",
  show: true,
});

const rightConfig = reactive({
  defaultShowConfig: {
    create: true,
  },
});

const clickRightAction = ({ key, value }) => {
  dialogFormVisible.value = true;
};

const data = ref([
  {
    title: "Title 1",
  },
  {
    title: "Title 2",
  },
  {
    title: "Title 3",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
]);
</script>

<style scoped lang="less">
.box-card {
  border: 1px solid black;
}
.monitor {
  background: #ffffff;
  .monitor-header {
    height: 200px;
    padding-left: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid gray;
    .monitor-header-title {
      font-size: 34px;
      color: #181f43;
    }
    .monitor-header-content {
      font-size: 18px;
    }
  }
  .monitor-content {
    margin: 40px;
    .monitor-content-list {
      margin-top: 40px;
    }
  }
  .monitor-type {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 80px;
    width: 100%;
    cursor: pointer;
    border: 1px solid rgba(24, 31, 67, 0.13);
    background: linear-gradient(180deg, #f9fbfc, #f8fafc);
    margin: 5px 0px;
    .monitor-type-title {
      font-size: 14px;
      color: rgba(24, 31, 67, 0.95);
      display: block;
    }
    .monitor-type-content {
      font-size: 12px;
      color: rgba(24, 31, 67, 0.5);
      display: block;
    }
  }
}
</style>
