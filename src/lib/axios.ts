import axios, { AxiosRequestConfig } from "axios";
import { asyncWrapper } from "./utils";

export async function FetchAPI(url: string, config?: AxiosRequestConfig) {
  return await asyncWrapper(axios.get(url, config));
}

export async function PostAPI(url: string, body: any, config?: AxiosRequestConfig) {
  return await asyncWrapper(axios.post(url, body, config));
}
