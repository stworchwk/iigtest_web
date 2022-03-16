<template>
  <a-row type="flex" justify="center" align="middle">
    <a-col :span="20">
      <a-page-header title="Edit Profile" style="padding-top: 0" />
      <a-form
        :model="formState"
        v-bind="layout"
        name="nest-messages"
        @finish="updateProfile"
      >
        <a-upload
          v-model:file-list="fileList"
          name="image"
          list-type="picture-card"
          class="avatar-uploader"
          action="/"
          :before-upload="beforeUpload"
          :show-upload-list="false"
          @change="handleChange"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="avatar"
            style="width: 60%"
          />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
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
</template>
<script lang="ts">
import { defineComponent, reactive, inject, h, ref, onMounted } from "vue";
import {
  SmileOutlined,
  FrownOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { useStore } from "vuex";

interface FormState {
  first_name: string;
  last_name: string;
  image: any;
}

export default defineComponent({
  components: {
    LoadingOutlined,
    PlusOutlined,
  },
  setup() {
    const axios: any = inject("axios"); // inject axios
    const router: any = inject("router"); // inject router

    const store = useStore();

    const fileList = ref([]);
    const loading = ref<boolean>(false);
    const imageUrl = ref<string>("");

    const formState = reactive<FormState>({
      first_name: "",
      last_name: "",
      image: null,
    });

    const getProfile = async () => {
      await store.dispatch("isLoading", true);
      try {
        const res = await axios.get(
          process.env.VUE_APP_SERVER_URL + "myProfile"
        );
        await store.dispatch("isLoading", false);
        if (res.data.status) {
          const profile = res.data?.result?.profile;
          formState.first_name = profile.first_name;
          formState.last_name = profile.last_name;
          imageUrl.value = profile.image_path;
        }
      } catch (err) {
        console.log("err");
      }
    };

    const updateProfile = (data: any): void => {
      store.dispatch("isLoading", true);
      let formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      formData.append("image", formState.image);

      axios
        .post(process.env.VUE_APP_SERVER_URL + "updateProfile", formData)
        .then((response: { data: any }) => {
          store.dispatch("isLoading", false);
          const res = response.data;
          if (res.status) {
            localStorage.setItem("full_name", res.result?.profile?.full_name);
            localStorage.setItem("thumbnail", res.result?.profile?.image_path);
            notification.open({
              message: res.message,
              icon: () => h(SmileOutlined, { style: "color: #42ba96" }),
            });

            //close modal
            store.dispatch("modalContentTag", null);
            store.dispatch("modalClose");

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

    const handleChange = (info: any) => {
      formState.image = info.file.originFileObj;
      getBase64(info.file.originFileObj, (base64Url: string) => {
        imageUrl.value = base64Url;
        loading.value = false;
      });
    };

    const getBase64 = (img: Blob, callback: (base64Url: string) => void) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result as string));
      reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any["fileList"][number]) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        notification.open({
          message: "You can only upload JPG file!",
          icon: () => h(FrownOutlined, { style: "color: #ff0e0e" }),
        });
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        notification.open({
          message: "Image must smaller than 2MB!",
          icon: () => h(FrownOutlined, { style: "color: #ff0e0e" }),
        });
      }
      return isJpgOrPng && isLt2M;
    };

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    onMounted(() => {
      getProfile();
    });

    return {
      fileList,
      formState,
      layout,
      updateProfile,
      loading,
      imageUrl,
      handleChange,
      beforeUpload,
    };
  },
});
</script>

<style>
.ant-upload.ant-upload-select.ant-upload-select-picture-card {
  width: 100%;
}
</style>