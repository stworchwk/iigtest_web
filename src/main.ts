import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import Antd from "ant-design-vue";
import axios from "axios";
import VueAxios from "vue-axios";

createApp(App)
  .use(store)
  .use(router)
  .use(Antd)
  .use(VueAxios, axios)
  .provide('axios', axios)
  .provide('router', router)
  .mount("#app");
