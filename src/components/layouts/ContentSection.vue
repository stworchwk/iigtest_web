<template>
  <a-layout-content style="margin: 16px">
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <router-view />
    </div>
  </a-layout-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  }
});
</script>
