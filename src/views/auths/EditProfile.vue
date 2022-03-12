<template>
  <a-row type="flex" justify="center">
    <a-col :span="14">
      <a-row
        type="flex"
        justify="center"
        align="middle"
        style="padding-top: 30px; padding-bottom: 50px"
      >
        <a-col :span="16">
          <a-page-header title="Edit Profile" />
          <a-form
            :model="formState"
            v-bind="layout"
            name="nest-messages"
            @finish="updateProfile"
          >
            <a-divider orientation="left">Profile</a-divider>
            <a-form-item
              name="first_name"
              :rules="[{ required: true, min: 5, max: 50 }]"
              label="First Name"
            >
              <a-input
                v-model:value="formState.first_name"
                placeholder="First Name"
              />
            </a-form-item>
            <a-form-item
              name="last_name"
              :rules="[{ required: true, min: 5, max: 50 }]"
              label="Last Name"
            >
              <a-input
                v-model:value="formState.last_name"
                placeholder="Last Name"
              />
            </a-form-item>
            <a-button type="primary" html-type="submit" block
              >Update Profile</a-button
            >
          </a-form>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, reactive, inject, h } from "vue";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { useStore } from "vuex";

interface FormState {
  first_name: string;
  last_name: string;
  image: any;
}

export default defineComponent({
  setup() {
    const axios: any = inject("axios"); // inject axios
    const router: any = inject("router"); // inject router

    const store = useStore();

    const formState = reactive<FormState>({
      first_name: "",
      last_name: "",
      image: null,
    });

    const updateProfile = (data: any): void => {
      store.dispatch("isLoading", true);
      let formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      axios
        .post(process.env.VUE_APP_SERVER_URL + "updateProfile", formData)
        .then((response: { data: any }) => {
          store.dispatch("isLoading", false);
          const res = response.data;
          if (res.status) {
            localStorage.setItem("full_name", res.result?.profile?.full_name);
            localStorage.setItem("thumbnail", res.result?.profile?.thumbnail);
            notification.open({
              message: res.message,
              icon: () => h(SmileOutlined, { style: "color: #42ba96" }),
            });
            setTimeout(() => {
              router.push({ name: "dashboard" });
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

    const getProfile = async () => {
      store.dispatch("isLoading", true);
      try {
        const res = await axios.get(
          process.env.VUE_APP_SERVER_URL + "myProfile"
        );
        await store.dispatch("isLoading", false);
        if (res.data.status) {
          const profile = res.data?.result?.profile;
          formState.first_name = profile.first_name;
          formState.last_name = profile.last_name;
        }
      } catch (err) {
        console.log("err");
      }
    };

    getProfile();

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return {
      formState,
      layout,
      updateProfile,
    };
  },
  created() {
    // this.getProfile;
  },
});
</script>