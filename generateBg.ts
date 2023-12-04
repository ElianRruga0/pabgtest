import axios, { AxiosRequestConfig } from "axios";

export const axiosConfig: AxiosRequestConfig = {
  baseURL: "https://beta-sdk.photoroom.com",
  headers: {
    "x-api-key": process.env["EXPO_PUBLIC_API_KEY"],
    Accept: "image/png, application/json",
  },
  responseType: "arraybuffer",
};

export const axiosInstance = axios.create(axiosConfig);

export const generateBg = async (formData: any): Promise<any> => {
  try {
    const { data } = await axiosInstance.post<any>(
      "/v1/instant-backgrounds",
      formData
    );
    return JSON.stringify(data);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const useMediaData = (uri: string) => {
  const filename = uri.split("/").pop() || "";

  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/png`;

  return {
    uri,
    filename,
    type,
  };
};
