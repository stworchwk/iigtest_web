<template>
  <a-row type="flex" justify="center" align="middle" style="height: 100vh">
    <a-col :span="14">
      <a-card hoverable style="margin-top: 50px; margin-bottom: 50px">
        <a-row
          type="flex"
          justify="center"
          align="middle"
          style="padding-top: 30px; padding-bottom: 50px"
        >
          <a-col :span="16">
            <a-page-header
              title="Sign up"
              @back="() => $router.push({ name: 'login' })"
            />
            <a-form
              :model="formState"
              v-bind="layout"
              name="nest-messages"
              @finish="register"
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
                  style="width: 50%"
                />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-divider orientation="left">Login</a-divider>
              <a-form-item
                name="username"
                label="Username"
                :rules="[
                  {
                    required: true,
                    max: 12,
                    pattern: '^[A-Za-z0-9_]+$',
                  },
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
                :rules="[{ required: true, min: 6 }]"
              >
                <a-input-password
                  v-model:value="formState.password"
                  @input="checkPassword"
                  placeholder="Password"
                  :valid="false"
                />
                <ul
                  style="margin-bottom: 0"
                  v-if="formState.password !== ''"
                >
                  <li
                    v-bind:class="{
                      valid: passwordValid.contains_six_characters,
                    }"
                  >
                    6 Characters
                  </li>
                  <li
                    v-bind:class="{
                      valid: passwordValid.contains_number,
                    }"
                  >
                    Contains Number
                  </li>
                  <li
                    v-bind:class="{
                      valid: passwordValid.contains_uppercase,
                    }"
                  >
                    Contains Uppercase
                  </li>
                  <li
                    v-bind:class="{
                      valid:
                        passwordValid.contains_special_character,
                    }"
                  >
                    Contains Special Character
                  </li>
                </ul>
              </a-form-item>
              <a-form-item
                label="Re - Password"
                name="password_confirmation"
                :rules="[
                  {
                    required: true,
                    min: 6,
                    validator: matchingPasswords,
                  },
                ]"
              >
                <a-input-password
                  :disabled="!formState.valid_password"
                  v-model:value="formState.password_confirmation"
                  placeholder="Re - Password"
                />
              </a-form-item>
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
                >Sign up</a-button
              >
            </a-form>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, reactive, inject, h, ref } from "vue";
import {
  SmileOutlined,
  FrownOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import type { RuleObject } from "ant-design-vue/es/form";
import { notification } from "ant-design-vue";
import { useStore } from "vuex";

interface FormState {
  username: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  image: any;
  valid_password: boolean;
}

export default defineComponent({
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup() {
    const axios: any = inject("axios"); // inject axios
    const router: any = inject("router"); // inject router

    const store = useStore();

    const fileList = ref([]);
    const loading = ref<boolean>(false);
    const imageUrl = ref<string>("");

    const register = (data: any): void => {
      store.dispatch("isLoading", true);
      let formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      formData.append('image', formState.image);

      axios
        .post(process.env.VUE_APP_SERVER_URL + "register", formData)
        .then((response: { data: any }) => {
          store.dispatch("isLoading", false);
          const res = response.data;
          if (res.status) {
            const result = res.result;
            localStorage.setItem("token_access", result.token_access);
            localStorage.setItem("full_name", result.full_name);
            localStorage.setItem("thumbnail", result.thumbnail);
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

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const matchingPasswords = async (_rule: RuleObject, value: string) => {
      if (formState.password_confirmation !== formState.password) {
        return Promise.reject("Passwords do NOT match");
      }
    };

    const formState = reactive<FormState>({
      username: "",
      password: "",
      password_confirmation: "",
      first_name: "",
      last_name: "",
      image: null,
      valid_password: false,
    });

    const passwordValid = {
      password_length: 0,
      contains_six_characters: false,
      contains_number: false,
      contains_uppercase: false,
      contains_special_character: false,
    };

     const handleChange = (info: any) => {
      formState.image = info.file.originFileObj
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

    return {
      fileList,
      formState,
      layout,
      matchingPasswords,
      passwordValid,
      register,
      loading,
      imageUrl,
      handleChange,
      beforeUpload
    };
  },

  methods: {
    checkPassword() {
      this.passwordValid.password_length = this.formState.password.length;
      const format = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

      if (this.passwordValid.password_length > 6) {
        this.passwordValid.contains_six_characters = true;
      } else {
        this.passwordValid.contains_six_characters = false;
      }

      this.passwordValid.contains_number = /\d/.test(this.formState.password);
      this.passwordValid.contains_uppercase = /[A-Z]/.test(
        this.formState.password
      );
      this.passwordValid.contains_special_character = format.test(
        this.formState.password
      );

      if (
        this.passwordValid.contains_six_characters === true &&
        this.passwordValid.contains_special_character === true &&
        this.passwordValid.contains_uppercase === true &&
        this.passwordValid.contains_number === true
      ) {
        this.formState.valid_password = true;
      } else {
        this.formState.valid_password = false;
      }
    },
  },
});
</script>

<style scoped>
ul {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0;
}

li {
  margin-bottom: 2px;
  color: #525f7f;
  position: relative;
}

li:before {
  content: "";
  width: 0%;
  height: 2px;
  background: #2ecc71;
  position: absolute;
  left: 0;
  top: 50%;
  display: block;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.valid {
  color: rgba(136, 152, 170, 0.8);
}
.valid:before {
  width: 100%;
}
</style>