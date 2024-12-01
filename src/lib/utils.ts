import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_API_URL_PROD
    : process.env.NEXT_PUBLIC_BASE_API_URL_DEV;

const instance = axios.create({
  timeout: 80000,
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true,
}) as any;

instance.defaults.retries = 3;
instance.defaults.retryDelay = 1000;

export const axiosPrivate = axios.create({
  timeout: 100000,
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true,
}) as any;

axiosPrivate.defaults.retries = 3;
axiosPrivate.defaults.retryDelay = 1000;

const createRetryInterceptor = (instance: any) => {
  return async (err: any) => {
    const config = err.config;
    
    // Don't retry on 401 (Unauthorized) or 403 (Forbidden)
    if (!config || !config.retries || err.response?.status === 401 || err.response?.status === 403) {
      return Promise.reject(err);
    }

    config.retryCount = config.retryCount ?? 0;
    if (config.retryCount >= config.retries) {
      return Promise.reject(err);
    }

    config.retryCount += 1;
    const delay = config.retryDelay || 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return instance(config);
  };
};

instance.interceptors.response.use(undefined, createRetryInterceptor(instance));
axiosPrivate.interceptors.response.use(
  undefined,
  createRetryInterceptor(axiosPrivate)
);

export const withAuthorization = () => {
  return async (endpoint: string) => {
    try {
      const { userId, getToken } = auth();
      const sessionToken = await getToken();

      if (!userId || !sessionToken) {
        redirect("/sign-in");
      }

      const res = await axiosPrivate.get(endpoint, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (res.data?.success) {
        return res.data?.data;
      } else {
        console.error("Failed to fetch data");
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
};

export default instance;
