import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface RetryConfig extends AxiosRequestConfig {
  retryCount?: number;
}

export const axiosISClient = axios.create({
  baseURL: `${import.meta.env.REACT_APP_IDENTITY_SERVER_URL}/api`,
  timeout: 60000,
});

// Retry 5xx status requests
axiosISClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;
    const status = error.response?.status ?? 0;

    if (status >= 500) {
      const previousCount = config.retryCount ?? 0;

      if (previousCount < MAX_RETRIES) {
        const nextCount = previousCount + 1;
        config.retryCount = nextCount;

        const delayMs = nextCount * RETRY_DELAY;
        await new Promise((resolve) => setTimeout(resolve, delayMs));

        return axiosISClient.request(config);
      }
    }

    return Promise.reject(error);
  }
);
