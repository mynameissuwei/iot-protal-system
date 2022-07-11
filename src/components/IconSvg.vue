<template>
  <svg class="icon-svg" aria-hidden="true">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "icon-svg",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    icon() {
      return `#svg-${this.name}`;
    },
  },
});
</script>
<style lang="less">
.icon-svg {
  height: 22px;
  width: 22px;
  fill: currentColor;
  display: inline-block;
  vertical-align: text-bottom;
  &.size-medium {
    height: 48px;
    width: 48px;
  }
  &.size-large {
    height: 90px;
    width: 90px;
  }
}
</style>
