import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

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
        const {data,status} = error.response as AxiosResponse;
        switch (status) {
            case 400:
                toast.error(data.title);
                break;
            case 401:
                toast.error("Unauthorized");
                break;
            case 404:
                toast.error("Not Found");
                break;
            // case 422:
            //     toast.error(data.errors[0].message);
            //     break;
            case 500:
                toast.error("Internal Server Error");
                break;
            default:
                // toast.error("Unknown Error");
                break;
        }
        return Promise.reject(error); // 让错误继续向上传递
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