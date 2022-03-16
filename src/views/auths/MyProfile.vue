<template>
  <div>
    <a-card hoverable :title="profile.full_name">
      <template #cover>
        <img alt="example" :src="profile.thumbnail" />
      </template>
      <template #extra>
        <a-button type="primary" shape="circle" size="large" @click="openEditProfile">
          <template #icon>
            <EditOutlined />
          </template>
        </a-button>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { EditOutlined } from "@ant-design/icons-vue";

interface Profile {
  full_name: string;
  thumbnail: string;
}

export default defineComponent({
  components: {
    EditOutlined,
  },
  setup() {
    const axios: any = inject("axios"); // inject axios
    const store = useStore();

    const profile = reactive<Profile>({
      full_name: "",
      thumbnail: "https://via.placeholder.com/500",
    });

    const getProfile = async () => {
      await store.dispatch("isLoading", true);
      try {
        const res = await axios.get(
          process.env.VUE_APP_SERVER_URL + "myProfile"
        );
        await store.dispatch("isLoading", false);
        if (res.data.status) {
          const res_profile = res.data?.result?.profile;
          profile.full_name = res_profile.full_name;
          if (
            res_profile.image_path !== "" &&
            res_profile.image_path !== null
          ) {
            profile.thumbnail = res_profile.image_path;
          }
        }
      } catch (err) {
        console.log("err");
      }
    };

    onMounted(() => {
      getProfile();
    });

    const openEditProfile = () => {
      store.dispatch("modalContentTag", "editProfile");
    }

    return {
      profile,
      openEditProfile
    };
  },
});
</script>
