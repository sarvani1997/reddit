import axios from "axios";

class Request {
  constructor(config = {}) {
    const mergedConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      ...config,
    };

    this.client = axios.create(mergedConfig);
    this.secret = undefined;

    this.authorizationInterceptor();
  }

  get headers() {
    return { Authorization: `Bearer ${this.secret}` };
  }

  authorizationInterceptor() {
    this.client.interceptors.request.use((config) => {
      if ("Authorization" in config.headers) {
        if (config.headers.Authorization == null) {
          // eslint-disable-next-line
          delete config.headers.Authorization;
        }

        return config;
      }

      if (this.secret) {
        // eslint-disable-next-line
        config.headers.Authorization = `Bearer ${this.secret}`;
      }
      return config;
    });
  }

  get(...args) {
    return this.client.get(...args);
  }

  post(...args) {
    return this.client.post(...args);
  }

  put(...args) {
    return this.client.put(...args);
  }

  delete(...args) {
    return this.client.delete(...args);
  }
}

export const request = new Request({ baseURL: import.meta.env.VITE_API_URL });

// export const socket = io(import.meta.env.VITE_API_URL);
