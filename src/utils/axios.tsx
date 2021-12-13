import axios, { AxiosResponse, AxiosPromise } from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://dualinvest-testapi.antimatter.finance/web/',
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json' }
})

const axiosInstanceSignature = axios.create({
  baseURL: 'https://dualinvest-testapi.antimatter.finance:8081/web/',
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json' }
})

export const Axios = {
  get<T = any>(url: string, params: { [key: string]: any } = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.get(url, { params })
  },
  post<T = any>(url: string, data: { [key: string]: any }, params = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.post(url, data, { params })
  },

  getSignature<T = any>(url: string, data: { [key: string]: any } = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstanceSignature.post(url, data)
  }
}

export type AxiosResponseType<T = any> = AxiosResponse<T>

export interface ResponseType<T = any> {
  msg: string
  code: number
  data: T
}

export type apiResponseType<T = any> = AxiosResponseType<ResponseType<T>>
