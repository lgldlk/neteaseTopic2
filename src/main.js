import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import "./common/css/common.css";
// if (process.env.NODE_ENV === "production") {
require("../mock/mock"); //在codesandbox上这个是报错的但是能正常使用

// }

createApp(App).use(store).use(router).use(Antd).mount("#app");