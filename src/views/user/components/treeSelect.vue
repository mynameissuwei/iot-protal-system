<template>
  <div class="tree_box" v-loading="loading">
    <el-select
      v-model="select.valueNames"
      multiple
      clearable
      filterable
      collapse-tags
      collapse-tags-tooltip
      ref="treeSelect"
      placeholder="请选择所属组织"
      @remove-tag="removeTag"
      :filter-method="selectFilter"
    >
      <el-option>
        <el-tree-v2
          ref="treeV2"
          :data="options"
          :props="TreeProps"
          :height="240"
          show-checkbox
          node-key="id"
          check-strictly
          :expand-on-click-node="false"
          :filter-method="treeFilter"
          check-on-click-node
          :default-checked-keys="select.value"
          @check-change="getCurrentSelectArray"
        ></el-tree-v2>
      </el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import { ElTreeV2, ElSelect } from "element-plus";
import {
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
const TreeProps = {
  value: "id",
  label: "title",
  children: "children",
};
interface TreeIter {
  id: string;
  label: string;
  children?: TreeIter[];
}
export default defineComponent({
  name: "treeselect",
  props: {
    options: {
      type: Array as PropType<TreeIter[]>,
      required: true,
    },
    modelValue: [],
  },
  components: {
    ElTreeV2,
    ElSelect,
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const select: any = reactive({
      value: modelValue.value,
      valueNames: [],
    });
    const loading = ref(true);
    const treeSelect = ref<HTMLElement | null>(null);
    const treeV2: any = ref<HTMLElement | null>(null);

    const selectFilter = (query: string) => {
      treeV2.value.filter(query);
    };
    const treeFilter = (query: string, node: any) => {
      return node.title?.indexOf(query) !== -1;
    };
    const removeTag = (value: any) => {
      let arr = treeV2.value.getCheckedNodes();
      arr.map((item: any) => {
        if (item.title === value) {
          treeV2.value.setChecked(item.id, false);
        }
      });
    };
    const getCurrentSelectArray = () => {
      let arr = treeV2.value.getCheckedNodes(false, false);
      select.valueNames = [];
      select.value = [];
      arr.length &&
        arr.forEach((item: any) => {
          select.valueNames.push(item.title);
          select.value.push(item.id);
        });
      emit("update:modelValue", select.value);
    };
    // 监听
    watch(modelValue, (v) => {
      select.value = v;
    });
    // 回显数据
    onMounted(async () => {
      await nextTick();
      setTimeout(() => {
        if (select.value) {
          let arr = treeV2.value.getCheckedNodes();
          arr.map((item: any) => {
            select.valueNames.push(item.title);
          });
          loading.value = false;
        }
      }, 2000);
    });
    return {
      treeSelect,
      treeV2,
      TreeProps,
      loading,
      select,
      selectFilter,
      treeFilter,
      getCurrentSelectArray,
      removeTag,
    };
  },
});
</script>
<style lang="less" scoped>
.tree_box {
  display: inline-block;
  width: 320px;
}
</style>
