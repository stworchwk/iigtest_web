<template>
  <a-layout-header style="background: #fff; padding: 0">
    <strong style="margin-left: 20px">IIG Test</strong>
    <a-menu mode="horizontal" style="float: right;">
      <a-sub-menu key="sub1">
        <template #icon>
          <a-avatar :src="profile.thumbnail" />
        </template>
        <template #title>{{ profile.full_name }}</template>
        <a-menu-item-group>
          <router-link :to="{ name: 'editProfile' }">
            <a-menu-item key="setting:1"
              ><user-outlined /> Edit Profile</a-menu-item
            >
          </router-link>
          <router-link :to="{ name: 'changePassword' }">
            <a-menu-item key="setting:2"
              ><lock-outlined /> Change Password</a-menu-item
            >
          </router-link>
          <a-menu-item key="setting:3" @click="logout()" style="color: #1890ff"
            ><logout-outlined /> Logout</a-menu-item
          >
        </a-menu-item-group>
      </a-sub-menu>
    </a-menu>
  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent, inject, h, createVNode } from "vue";
import {
  UserOutlined,
  LogoutOutlined,
  SmileOutlined,
  FrownOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import { notification, Modal } from "ant-design-vue";
import axios from "axios";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    UserOutlined,
    LogoutOutlined,
    LockOutlined,
  },
  setup() {
    const router: any = inject("router"); // inject router
    const store = useStore();

    const profile = {
      full_name: localStorage.full_name,
      thumbnail:
        localStorage.thumbnail === "" || localStorage.thumbnail === "null"
          ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          : localStorage.thumbnail,
    };
    const logout = () => {
      Modal.confirm({
        title: "Are you sure you want to log out?",
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          store.dispatch("isLoading", true);
          axios
            .post(process.env.VUE_APP_SERVER_URL + "logout")
            .then((response: { data: any }) => {
              const res = response.data;
              if (res.status) {
                notification.open({
                  message: res.message,
                  icon: () => h(SmileOutlined, { style: "color: #42ba96" }),
                });
                localStorage.removeItem("token_access");
                localStorage.removeItem("full_name");
                localStorage.removeItem("thumbnail");
                setTimeout(() => {
                  store.dispatch("isLoading", false);
                  router.go({ name: "login" });
                }, 500);
              } else {
                let description = "";
                const errors = res.result?.errors;
                for (var key in errors) {
                  description +=
                    'field "' + key + '": ' + errors[key][0] + "\n";
                }
                notification.open({
                  message: res.message,
                  description,
                  icon: () => h(FrownOutlined, { style: "color: #ff0e0e" }),
                });
              }
            })
            .catch((error) => {
              store.dispatch("isLoading", false);
              notification.open({
                message: error.response?.data?.message,
                icon: () => h(FrownOutlined, { style: "color: #ff0e0e" }),
              });
            });
        },
      });
    };

    return {
      logout,
      profile
    };
  }
});
</script>