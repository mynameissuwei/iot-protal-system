<template>
  <div>hello，world！</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { test } from "@/api";

onMounted(() => {
  const params = { a: 1 };
  test(params).then((data) => {
    console.log(data);
  });
});
</script>
