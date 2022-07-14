import useOrganizationStore from "./organization";
// import useCounterStore from "./counter";

// 统一导出useStore方法
export default function useStore() {
  return {
    user: useOrganizationStore(),
    // counter: useCounterStore(),
  };
}

// <script setup>
// import { storeToRefs } from 'pinia'
// import useStore from './store'
// const { counter } = useStore()

// // 使用storeToRefs可以保证解构出来的数据也是响应式的
// const { count, double } = storeToRefs(counter)
// </script>
