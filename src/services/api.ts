import { storageAuthTokenGet } from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosInstance } from "axios";

type SignOut = () => void;

type PromiseType = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}
type APIInstaceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => void;

}

const api = axios.create({
  baseURL: "http://192.168.100.4:3333",
}) as APIInstaceProps;

let isRefreshing = false;
let failedQueue: Array<PromiseType> = [];

api.registerInterceptTokenManager = SignOut => {
  const interceptTokenManager = api.interceptors.response.use(Response => Response, async (requestError) => {
    if (requestError?.response?.status === 401) {
      if (requestError.response.data?.message === "token.expired" || requestError.response.data?.message === "token.invalid") {
        const { refresh_token } = await storageAuthTokenGet()

        if (!refresh_token) {
          SignOut();
          return Promise.reject(requestError)
        }

        const originalRequest = requestError.config;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch((error) => {
              throw error;
            })
        }
        isRefreshing = true;

      }
      SignOut();
    }

    if (requestError.response && requestError.response.data) {
      return Promise.reject(new AppError(requestError.response.data.message));
    } else {
      return Promise.reject(requestError);
    }
  });

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  }
}



export { api }