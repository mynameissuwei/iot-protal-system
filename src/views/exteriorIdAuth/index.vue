<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from "@/api";
const router = useRouter();

onMounted(() => {
  getAuth().then((res) => {
    router.push({
      path: JSON.stringify(res) === "{}" ? "/createIdAuth" : "/stepComplete",
    });
  });
});
</script>
