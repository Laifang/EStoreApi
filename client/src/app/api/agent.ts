import axios, { AxiosError, AxiosResponse } from "axios";

// 设置默认的baseURL
axios.defaults.baseURL = "http://localhost:5130/api";

// 作用：将axios的response.data返回
const responseBody = (response: AxiosResponse) => response.data;

// 拦截器
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        console.log('Catch Error by Interceptor');
        return Promise.reject(error); // 让错误继续向上传递

        // if (error.response) {
        //     // 请求已发送，但服务器响应的状态码不在 2xx 范围内
        //     console.log(error.response.data);
        //     console.log(error.response.status);
        //     console.log(error.response.headers);
        // } else {
        //     // 一些错误是在设置请求时触发的，如网络错误，超时等
        //     console.log("Error", error.message);
        // }
        // return Promise.reject(error);
    }
);


// 封装axios请求，
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

// 定义Catalog模块API，包含list和detail两个API
const Catalog = {
    list: () => requests.get("/products"),
    detail: (id: number) => requests.get(`/products/${id}`),
}

// 定义测试错误API
const TestErrors = {
    get400Error: () => requests.get("Buggy/bad-request"),
    get401Error: () => requests.get("Buggy/unauthorized"),
    get404Error: () => requests.get("Buggy/not-found"),
    getValidattionError: () => requests.get("Buggy/validation-error"),
    get500Error: () => requests.get("Buggy/internal-server-error"),
}


const agent = {
    Catalog,
    TestErrors
}

// agent 导出
export default agent;