import { createRouter, createWebHistory } from "vue-router";
import mainLayout from "@/components/mainLayout/index";
import { getUserInfo } from "@/api/user";
import store from "@/store";
const constantRoutes = [{
    path: "/layout",
    component: mainLayout,
}, ];

export const asyncRoutes = [{
    path: "/",
    component: mainLayout,
    redirect: "/index",
    meta: {
        title: "xx管理",
    },
    children: [{
        path: "index",
        name: "Index",
        component: () =>
            import ("@/views/testForm"),
        meta: {
            title: "第二题",
            roles: ["admin"],
        },
    }, ],
}, ];

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
});

// 路由守卫
let registerRouteFresh = true,
    hasGetUserInfo = false;

router.beforeEach(async(to, from, next) => {
    if (!hasGetUserInfo) {
        let userInfo = await getUserInfo();
        store.commit("user/setUserData", userInfo);
        hasGetUserInfo = true;
    }

    let routes = store.getters["user/getRoute"];

    if (registerRouteFresh) {
        routes.forEach((value) => {
            router.addRoute(value);
        });
        next({...to, replace: true });
        registerRouteFresh = false;
    } else {
        next();
    }
});
export default router;