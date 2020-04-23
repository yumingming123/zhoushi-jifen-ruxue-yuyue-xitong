import axios from 'axios'
// import qs from 'qs'

// 引入element-ui模块
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// 导入加载组件
// import { Loading } from "element-ui";
if (process.env.NODE_ENV == "development") { // production development
    // axios.defaults.baseURL = "http://36.156.152.127:8898/";
} else {
    // 生产环境地址
}
axios.defaults.timeout = 5000;
// 给加载层设置容器  便于后来响应之后关闭
// var loadings;
// 请求拦截器
axios.interceptors.request.use(
    function (config) {
        // 在发起请求请做一些业务处理
        // 如开启loading  对请求的参数做处理 添加token等
        // 例  在请求的时候开启elementui的loading
        // loadings = Loading.service({ fullscreen: true });
        // loadings = Loading.service();
        if (config.method == "post") {
            config.data = JSON.stringify(config.data);
        }
        // console.log(config);
        return config;
    },
    function (error) {
        // 对请求失败做处理
        return Promise.reject(error);
    }
);
// 响应拦截
axios.interceptors.response.use(function (config) {
    // 在请求之后做处理 如关闭loading
    // loadings.close();
    // 对返回过来的数据进行过滤操作
    // console.log(config.data);
    // console.log(config); // 返回的config 被下面的res接收（有两层的data）
    // return config.data;  // 若返回一层里面的data  那么下面axios接收时只需再剥一层data
    return config;
}, function (error) {
    // 对请求失败做处理
    // loadings.close();
    return Promise.reject(error);
});

// post 请求和 set 请求 axios对两种请求方式是不同的
function http(config) {
    // // toLowerCase 将字符串转换成小写
    if (config.method.toLowerCase() === "post") {
        config.data = JSON.stringify(config.data, {
            arrayFormat: "repeat",
            allowDots: true
        });
    } else {
        config.params = config.data;
    }
    return service(config);
}

export default axios