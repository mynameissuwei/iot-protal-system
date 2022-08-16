<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ldapCheck } from "@/api";
const router = useRouter();

onMounted(() => {
  ldapCheck().then((res) => {
    router.push({
      path: res ? "/stepComplete" : "/createIdAuth",
    });
  });
});
</script>
