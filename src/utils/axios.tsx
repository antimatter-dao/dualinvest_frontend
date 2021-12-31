import axios, { AxiosResponse, AxiosPromise } from 'axios'
import { retry } from 'utils/retry'

const axiosInstance = axios.create({
  // baseURL: 'https://dualinvest-api.antimatter.finance/web/',
  baseURL: 'https://dualinvest-testapi.antimatter.finance/web/',
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json' }
})

export const getSignatures = async <T, R>(args: T, numberOfSignRequired = 3, route: string): Promise<Array<R>> => {
  try {
    const signRoutes = [
      'https://node1.antimatter.finance/web/' + route,
      'https://node2.antimatter.finance/web/' + route,
      'https://node3.antimatter.finance/web/' + route
    ]
    const httpRequestsList = signRoutes.map(
      route =>
        retry(
          () =>
            new Promise((resolve, reject) => {
              axios
                .post<AxiosResponse<ResponseType<R>>>(route, args, { timeout: 3000 })
                .then(r => {
                  if (!r.data.data) {
                    reject('singnature request failed')
                  } else {
                    resolve(r.data.data)
                  }
                })
                .catch(() => {
                  reject('singnature request failed')
                })
            }),
          { n: 2, minWait: 0, maxWait: 0 }
        ).promise
    )

    const aggregated: any[] = []
    let error = 0
    const requestList: Promise<Array<R>> = new Promise((resolve, reject) => {
      httpRequestsList.map(promise => {
        promise
          .then(r => {
            aggregated.push(r)
            if (aggregated.length >= numberOfSignRequired) {
              resolve(aggregated.slice(0, numberOfSignRequired))
            }
          })
          .catch(() => {
            error++
            if (error > signRoutes.length - numberOfSignRequired) {
              reject('Cannot get signature')
            }
          })
      })
    })
    const signRes = await requestList

    return signRes
  } catch (e) {
    throw Error('Cannot get signature99')
  }
}

export const Axios = {
  get<T = any>(url: string, params: { [key: string]: any } = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.get(url, { params })
  },
  post<T = any>(url: string, data: { [key: string]: any } | undefined, params = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.post(url, data, { params })
  },
  getSignatures: getSignatures
}

export type AxiosResponseType<T = any> = AxiosResponse<T>

export interface ResponseType<T = any> {
  msg: string
  code: number
  data: T
}

export type apiResponseType<T = any> = AxiosResponseType<ResponseType<T>>
