import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import router from "../router/Routes";

const sleep = () => new Promise(resolve => setTimeout(resolve, 300))


// 设置默认的baseURL
axios.defaults.baseURL = "http://localhost:5130/api";
axios.defaults.withCredentials = true; // 允许跨域请求带cookie,要与后端同时配置这个选项才能

// 作用：将axios的response.data返回
const responseBody = (response: AxiosResponse) => response.data;

// 拦截器
axios.interceptors.response.use(
    async response => {
        await sleep(); // 延迟500ms，模拟网络延迟
        return response;
    },
    (error: AxiosError) => {
        // 解构赋值出 data 和 status,data是服务器返回的错误信息，status是状态码
        const { data, status } = error.response as AxiosResponse;
        switch (status) {
            case 400:
                if (data.errors) { // 如果存在错误信息，则将错误信息格式化
                    const modelStateErrors: string[] = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) { //防止不存在key的情况
                            modelStateErrors.push(data.errors[key]);
                        }
                    }
                    // 将错误信息数组展平成字符串并抛出
                    throw modelStateErrors.flat();
                }
                toast.error(data.title);
                break;
            case 401:
                toast.error(data.title);
                break;
            case 404:
                router.navigate("/not-found", { state: { error: data } });
                break;
            case 500:
                router.navigate("/server-error", { state: { error: data } });
                break;
            default:
                break;
        }
        return Promise.reject(error.response); // 让错误继续向上传递
    }
);


// 封装axios请求，
const requests = {
    get: (url: string,params?:URLSearchParams) => axios.get(url,{params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

// 定义Catalog模块API，包含list和detail两个API
const Catalog = {
    list: (params: URLSearchParams) => requests.get("/products",params),
    detail: (id: number) => requests.get(`/products/${id}`),
    fetchFilters: () => requests.get("/products/filters"),
}

// 定义测试错误API
const TestErrors = {
    get400Error: () => requests.get("Buggy/bad-request"),
    get401Error: () => requests.get("Buggy/unauthorized"),
    get404Error: () => requests.get("Buggy/not-found"),
    getValidattionError: () => requests.get("Buggy/validation-error"),
    get500Error: () => requests.get("Buggy/internal-server-error"),
}


const ShoppingCart = {
    get: () => requests.get("/ShoppingCarts"),
    addItem: (productId: number, quantity: number = 1) => requests.post(`ShoppingCarts/addItem?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity: number = 1) => requests.delete(`ShoppingCarts/removeItem?productId=${productId}&quantity=${quantity}`),
}


const agent = {
    Catalog,
    TestErrors,
    ShoppingCart,
}

// agent 导出
export default agent;