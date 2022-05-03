import { isJson } from "./verify";

// 本地化存储
export const setLocalStore = (key, content) => {
    if (!key) return;
    if (typeof content !== "string") {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(key, content);
};

// 本地化获取
export const getLocalStore = (key) => {
    const value = localStorage.getItem(key);
    if (isJson(value)) {
        return JSON.parse(value);
    } else {
        return value;
    }
};

// 本地化删除
export const removeLocalStore = (key) => {
    if (!key) return;
    return window.localStorage.removeItem(key);
};