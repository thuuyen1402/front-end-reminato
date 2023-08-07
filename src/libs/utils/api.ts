import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    withCredentials: true,
    headers: {
        "Content-type": "application/json",
    },
});

export const getCancelTokenSource = () => {
    return axios.CancelToken.source();
  };
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkCancel = (value: any) => {
    return axios.isCancel(value);
};
  

// Writing interceptor if needed

export default api