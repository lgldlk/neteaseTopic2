import { createStore } from "vuex";
import user from "./modules/user";
import system from "./modules/system";
export default createStore({
    modules: { user, system },
});