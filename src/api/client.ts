import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { tokenStore } from '@/store/token';

interface ReissueResponse {
  accessToken: string;
  id: number;
}

const client = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenStore.get();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

let refreshPromise: Promise<string> | null = null;

client.interceptors.response.use(
  (res: AxiosResponse): AxiosResponse => res,
  async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post<ReissueResponse>(
              '/api/auth/reissue',
              {},
              { withCredentials: true }
            )
            .then((res: AxiosResponse<ReissueResponse>): string => {
              const newToken = res.data.accessToken;
              tokenStore.set(newToken);
              return newToken;
            })
            .finally((): void => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return client(originalRequest);
      } catch {
        tokenStore.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default client;