<template>
  <a-layout style="min-height: 100vh" v-if="token_access && token_access !== ''">
    <LeftSideBar />
    <a-layout>
      <HeaderBar />
      <ContentSection />
      <FooterSection />
    </a-layout>
  </a-layout>
  <router-view v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderBar from "@/components/layouts/HeaderBar.vue";
import LeftSideBar from "@/components/layouts/LeftSideBar.vue";
import ContentSection from "@/components/layouts/ContentSection.vue";
import FooterSection from "@/components/layouts/FooterSection.vue";
import axios from 'axios'

export default defineComponent({
  components: {
    HeaderBar,
    LeftSideBar,
    ContentSection,
    FooterSection,
  },
  setup() {
    const token_access = localStorage.token_access
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token_access;
    return {
      token_access
    };
  }
});
</script>