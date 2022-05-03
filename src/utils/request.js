import axios from "axios";

import store from "@/store";
// 创建 axios 实例
const request = axios.create({
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});
// 异常拦截处理器
const errorHandler = (error) => {
    const status = error.response && error.response.status;
    switch (status) {
        case 400:
            error.message = "请求错误";
            break;
        case 401:
            error.message = "未授权，请登录";
            break;
        case 403:
            error.message = "拒绝访问";
            break;
        case 404:
            error.message = `请求地址出错: 
            ${error.response.config.url}`;
            break;
        case 408:
            error.message = "请求超时";
            break;
        case 500:
            error.message = "服务器内部错误";
            break;
        case 501:
            error.message = "服务未实现";
            break;
        case 502:
            error.message = "网关错误";
            break;
        case 503:
            error.message = "服务不可用";
            break;
        case 504:
            error.message = "网关超时";
            break;
        case 505:
            error.message = "HTTP版本不受支持";
            break;
        default:
            break;
    }
    return Promise.reject(error);
};
// request interceptor
request.interceptors.request.use((config) => {
    // 让每个请求携带 token
    config.headers.Authorization = `token ${store.getters["user/token"]}`;
    return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
    const dataAxios = response.data;
    console.log(
        "🥖 ~ file: request.js ~ line 61 ~ request.interceptors.response.use ~ dataAxios",
        dataAxios
    );
    const { code } = dataAxios;
    // 根据 code 进行判断
    if (code === undefined) {
        //没有code说明不是项目的接口直接返回请求体数据
        return dataAxios;
    } else {
        // 有 code 代表这是一个后端接口 可以进行进一步的判断
        switch (code) {
            case 200:
                //code === 200 代表没有错误
                return dataAxios.data;
            default:
                // 不是规定的 code
                return "";
        }
    }
}, errorHandler);

export default function(url = "", params = {}, type = "GET") {
    let promise;
    return new Promise((resolve, reject) => {
        // 2.1 判断请求的类型
        if (type.toUpperCase() === "GET") {
            // 拼接字符串
            let paramsStr = "";
            Object.keys(params).forEach((key) => {
                paramsStr += key + "=" + params[key] + "&";
            });

            /*
                                                                                            注意：防止缓存，在尾部加了时间戳
                                                                                          */
            if (paramsStr) {
                paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf("&"));
                if (url.indexOf("127.0.0.1") === -1) {
                    url += "?" + paramsStr + "&Geek-James=" + randomCode(20);
                } else {
                    url += "?" + paramsStr;
                }
            } else {
                if (url.indexOf("127.0.0.1") === -1) {
                    url += "?Geek-James=" + randomCode(20);
                }
            }
            promise = request.get(url);
        } else if (type.toUpperCase() === "POST") {
            promise = request.post(url, params);
        }
        promise
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/*生成指定长度的随机数*/
function randomCode(length) {
    let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let result = "";
    for (let i = 0; i < length; i++) {
        let index = Math.ceil(Math.random() * 9);
        result += chars[index];
    }
    return result;
}