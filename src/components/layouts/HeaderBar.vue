<template>
  <a-layout-header style="background: #fff; padding: 0">
    <strong style="margin-left: 20px">IIG Test</strong>
    <a-menu mode="horizontal" style="float: right">
      <a-sub-menu key="sub1">
        <template #icon>
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </template>
        <template #title>ศตวรรษ อรชุนเวคิน</template>
        <a-menu-item-group>
          <a-menu-item key="setting:1"
            ><user-outlined /> แก้ไขโปรไฟล์</a-menu-item
          >
          <a-menu-item key="setting:2" @click="logout()"
            ><logout-outlined /> ออกจากระบบ</a-menu-item
          >
        </a-menu-item-group>
      </a-sub-menu>
    </a-menu>
  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent, inject, h } from "vue";
import {
  UserOutlined,
  LogoutOutlined,
  SmileOutlined,
  FrownOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import axios from "axios";

export default defineComponent({
  components: {
    UserOutlined,
    LogoutOutlined,
  },
  setup() {
    const router: any = inject("router"); // inject router

    const logout = () => {
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
            setTimeout(() => {
              router.go({ name: "login" });
            }, 500);
          } else {
            let description = "";
            const errors = res.result?.errors;
            for (var key in errors) {
              description += 'field "' + key + '": ' + errors[key][0] + "\n";
            }
            notification.open({
              message: res.message,
              description,
              icon: () => h(FrownOutlined, { style: "color: #ff0e0e" }),
            });
          }
        })
        .catch((error) => {
          notification.open({
            message: error.response?.data?.message,
            icon: () => h(FrownOutlined, { style: "color: #ff0e0e" }),
          });
        });
    };

    return { logout };
  },
});
</script>