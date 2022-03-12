<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible>
    <div class="logo" />
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
      <router-link :to="{ name: 'dashboard' }">
        <a-menu-item key="dashboard">
          <pie-chart-outlined />
          <span>Dashboard</span>
        </a-menu-item>
      </router-link>
      <a-sub-menu key="management">
        <template #title>
          <span>
            <setting-outlined />
            <span>Management</span>
          </span>
        </template>
        <router-link :to="{ name: 'manageUsers' }">
          <a-menu-item key="manageUsers">Users</a-menu-item>
        </router-link>
        <router-link :to="{ name: 'manageCategories' }">
          <a-menu-item key="manageCategories">Categories</a-menu-item>
        </router-link>
        <router-link :to="{ name: 'manageUnits' }">
          <a-menu-item key="manageUnits">Units</a-menu-item>
        </router-link>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    PieChartOutlined,
    SettingOutlined,
  },
  setup() {
    return {
      collapsed: ref<boolean>(false),
      selectedKeys: ref<string[]>(["dashboard"]),
    };
  }
});
</script>

<style>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}
</style>
