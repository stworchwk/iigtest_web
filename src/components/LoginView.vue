<template>
  <a-row type="flex" justify="center" align="middle" style="height: 100vh">
    <a-col :span="14">
      <a-card hoverable bodyStyle="padding: 0">
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="12" style="padding: 40px">
            <h2>Welcome back</h2>
            <p>Login to the Dashboard</p>
            <a-form
              :model="formState"
              name="basic"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
            >
              <a-form-item
                label="Username"
                name="username"
                :rules="[
                  { required: true, message: 'Please input your username!' },
                ]"
              >
                <a-input
                  v-model:value="formState.username"
                  placeholder="Username"
                />
              </a-form-item>

              <a-form-item
                label="Password"
                name="password"
                :rules="[
                  { required: true, message: 'Please input your password!' },
                ]"
              >
                <a-input-password
                  v-model:value="formState.password"
                  placeholder="Password"
                />
              </a-form-item>

              <a-form-item name="remember">
                <a-checkbox v-model:checked="formState.remember"
                  >Remember me</a-checkbox
                >
              </a-form-item>

              <a-button type="primary" html-type="submit" block>Login</a-button>
            </a-form>
            <a-divider>Or</a-divider>
            <router-link :to="{ name: 'register' }">
              <a-button type="primary" block>Sign up</a-button>
            </router-link>
          </a-col>
          <a-col :span="12">
            <img
              src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
              style="width: 100%;"
            />
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, reactive, inject, h } from "vue";
import { notification } from "ant-design-vue";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons-vue";

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

export default defineComponent({
  setup() {
    const axios: any = inject("axios"); // inject axios
    const router: any = inject("router"); // inject router

    const formState = reactive<FormState>({
      username: "",
      password: "",
      remember: true,
    });
    const onFinish = (values: any) => {
      let formData = new FormData();
      for (var key in values) {
        formData.append(key, values[key]);
      }

      axios
        .post(process.env.VUE_APP_SERVER_URL + "login", formData)
        .then((response: { data: any }) => {
          const res = response.data;
          if (res.status) {
            const token_access = res.result.token_access;
            localStorage.setItem("token_access", token_access);
            notification.open({
              message: res.message,
              icon: () => h(SmileOutlined, { style: "color: #42ba96" }),
            });
            setTimeout(() => {
              router.go({ name: "dashboard" });
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
        });
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>
