import { useEffect } from "react";
import { axiosPrivate } from "@/lib/utils";
import { useAuth, useSession } from "@clerk/nextjs";

const useAxiosPrivate = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config: any) => {
        const accessToken = await getToken();
        console.log(accessToken, "TOKEN");
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        config.withCredentials = true;
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // const responseIntercept = axiosPrivate.interceptors.response.use(
    //   (response) => response,
    //   async (error) => {
    //     const prevRequest = error?.config;
    //     if (error?.response?.status === 403 && !prevRequest.sent) {
    //       prevRequest.sent = true;
    //       const newAccessToken = await refresh();
    //       prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
    //       return axiosPrivate(prevRequest);
    //     }
    //     return Promise.reject(error);
    //   }
    // );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      // axiosPrivate.interceptors.request.eject(responseIntercept);
    };
  }, []);

  return axiosPrivate;
};

export default useAxiosPrivate;
