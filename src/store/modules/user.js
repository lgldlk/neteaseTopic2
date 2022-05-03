import { asyncRoutes } from "@/router";

const state = {
    token: "", //这里写死了token做验证
    username: "",
    avatar: "",
    role: [],
    router: [],
};

const getters = {
    token: (state) => {
        if (state.token) {
            return state.token;
        }
        state.token = "123"; //localStorage.getItem("token");合理来说应该从本地存储获取，这里直接模拟了
        return state.token;
    },
    username: (state) => state.username,
    avatar: (state) => state.avatar,
    getRoute(state) {
        //根据用户权限获取路由
        if (state.router.length) {
            return state.router;
        } else {
            let arr = [];
            asyncRoutes.map((value) => {
                let child = [];
                if (value.children && value.children.length) {
                    value.children.map((val) => {
                        if (val.meta.roles && val.meta.roles.length) {
                            let array = val.meta.roles;
                            for (let index = 0; index < array.length; index++) {
                                const element = array[index];
                                if (state.role.includes(element)) {
                                    child.push(val);
                                    break;
                                }
                            }
                        } else {
                            child.push(val);
                        }
                    });
                }
                value.child = child;
                arr.push(value);
            });
            state.router = arr;
            return state.router;
        }
    },
};
const mutations = {
    setUserData(state, preload) {
        state.username = preload.username;
        state.avatar = preload.avatar;
        state.role = preload.role;
    },
};
const actions = {};
export default { namespaced: true, state, getters, mutations, actions };