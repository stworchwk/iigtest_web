<template>
  <a-row type="flex" justify="center" align="middle">
    <a-col :span="24">
      <a-page-header title="Change Password" style="padding-top: 0" />
      <a-form
        :model="formState"
        v-bind="layout"
        name="nest-messages"
        @finish="register"
      >
        <a-form-item
          label="Current Password"
          name="current_password"
          :rules="[
            {
              required: true,
              min: 6,
            },
          ]"
        >
          <a-input-password
            v-model:value="formState.current_password"
            placeholder="Current Password"
          />
        </a-form-item>
        <a-divider orientation="left">New Password</a-divider>
        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, min: 6 }]"
        >
          <a-input-password
            :disabled="formState.current_password.length < 6"
            v-model:value="formState.password"
            @input="checkPassword"
            placeholder="Password"
            :valid="false"
          />
          <ul style="margin-bottom: 0" v-if="formState.password !== ''">
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
                valid: passwordValid.contains_special_character,
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
        <a-button type="primary" html-type="submit" block
          >Update Password</a-button
        >
      </a-form>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, reactive, inject, h } from "vue";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons-vue";
import type { RuleObject } from "ant-design-vue/es/form";
import { notification } from "ant-design-vue";
import { useStore } from "vuex";

interface FormState {
  current_password: string;
  password: string;
  password_confirmation: string;
  valid_password: boolean;
}

export default defineComponent({
  setup() {
    const axios: any = inject("axios"); // inject axios
    const router: any = inject("router"); // inject router

    const store = useStore();

    const register = (data: any): void => {
      store.dispatch("isLoading", true);
      let formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }

      axios
        .post(process.env.VUE_APP_SERVER_URL + "updatePassword", formData)
        .then((response: { data: any }) => {
          store.dispatch("isLoading", false);
          const res = response.data;
          if (res.status) {
            localStorage.removeItem("token_access");
            localStorage.removeItem("full_name");
            localStorage.removeItem("thumbnail");
            notification.open({
              message: res.message,
              icon: () => h(SmileOutlined, { style: "color: #42ba96" }),
            });

            //close modal
            store.dispatch("modalContentTag", null);
            store.dispatch("modalClose");

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
      current_password: "",
      password: "",
      password_confirmation: "",
      valid_password: false,
    });

    const passwordValid = {
      password_length: 0,
      contains_six_characters: false,
      contains_number: false,
      contains_uppercase: false,
      contains_special_character: false,
    };

    return {
      formState,
      layout,
      matchingPasswords,
      passwordValid,
      register,
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