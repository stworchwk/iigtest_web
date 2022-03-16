<template>
  <a-modal
    v-model:visible="modalIsActive"
    :title="modalHeader"
    @cancel="closeModal"
    :footer="null"
  >
    <EditProfile v-if="modalContentTag === 'editProfile'" />
    <MyProfile v-if="modalContentTag === 'myProfile'" />
    <ChangePassword v-if="modalContentTag === 'changePassword'" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import EditProfile from "@/views/auths/EditProfile.vue";
import MyProfile from "@/views/auths/MyProfile.vue";
import ChangePassword from "@/views/auths/ChangePassword.vue";

export default defineComponent({
  components: {
    EditProfile,
    MyProfile,
    ChangePassword,
  },
  setup() {
    const store = useStore();

    const closeModal = () => {
      store.dispatch("modalContentTag", null);
      store.dispatch("modalClose");
    };
    return { closeModal };
  },
  computed: {
    ...mapState(["modalIsActive", "modalContentTag"]),
    modalHeader() {
      switch (this.modalContentTag) {
        case "editProfile":
          return "Edit Profile";
        case "myProfile":
          return "My Profile";
        case "changePassword":
          return "Change Password";
        default:
          return "Modal Header";
      }
    },
  },
});
</script>