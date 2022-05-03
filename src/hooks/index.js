import { useRouter, useRoute } from "vue-router";
import { throttle } from "@/utils";
import { ref } from "vue";
import { useStore } from "vuex";
// hook常用方法
export default function() {
    const router = useRouter(),
        route = useRoute();
    /**
     * @description: navTo跳转页面
     * @param {String } name 路由name
     * @param {Object} data  要传递的参数
     * @param {Boolean} useQuery 为true跳转使用query作为参数，false则使用params
     */
    const routerChange = (name, data, useQuery = true) => {
        throttle(() => {
            if (useQuery) {
                router.push({
                    name,
                    query: data,
                });
            } else {
                router.push({
                    name,
                    params: data,
                });
            }
        }, 300);
    };
    const isLoading = ref(false), //是否在刷新数据
        loaded = ref(false); //是否加载完毕

    const store = useStore();
    return {
        store,
        route,
        routerChange,
        isLoading,
        loaded,
    };
}