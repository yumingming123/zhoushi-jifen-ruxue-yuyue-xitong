import axios from "axios";
import qs from "qs";

// 创建一个axios实例
// const service = axios.create({
    // http://s.matrix-united.com/learning/
    //   baseURL: "http://b.-****.cn/*****/", // 配置总地址 /setUser/3
    //   baseURL: "http://36.156.152.127:8898/", // 配置总地址 /setUser/3
    // timeout: 5000, // 设置超时时间
    // withCredentials: true // 允许携带cookie code
// });

axios.defaults.timeout = 5000;
// request interceptor
axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
axios.interceptors.response.use(
    response => {
        // const res = response.data;
        return response;
    },
    error => {
        console.log("err" + error); // for debug
        return Promise.reject(error);
    }
);

// post 请求和 set 请求 axios对两种请求方式是不同的
function http(config) {
    // // toLowerCase 将字符串转换成小写
    if (config.method.toLowerCase() === "post") {
        config.data = qs.stringify(config.data, {
            arrayFormat: "repeat",
            allowDots: true
        });
    } else {
        config.params = config.data;
        config.data = null;
    }
    return axios(config);
}

export default http;