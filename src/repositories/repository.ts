import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'
import camelcaseKeysDeep from 'camelcase-keys-deep'
import decamelizeKeysDeep from 'decamelize-keys-deep'
import Cookies from 'js-cookie'
import qs from 'qs'

const snakeParams = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (config.params) {
    config.params = decamelizeKeysDeep(config.params)
  }
  return config
}

const addAuthorizationToken = (
  config: AxiosRequestConfig
): AxiosRequestConfig => {
  const name = `auth._token.${process.env.AUTH_STRATEGY_NAME}`
  const token = Cookies.get(name)
  if (token) {
    config.headers.Authorization = token
  }
  return config
}

const convertResponse = (data: any, headers: any) => {
  Object.assign(headers, camelcaseKeysDeep(headers))
  return camelcaseKeysDeep(data)
}

const convertRequest = (params: any) => {
  return decamelizeKeysDeep(params)
}

const paramsSerializer = (params: any) => {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}

const createRepository = (): AxiosInstance => {
  const baseUrl = process.server
    ? process.env.SERVER_API_BASE_URL
    : process.env.CLIENT_API_BASE_URL

  const instance = axios.create({
    baseURL: baseUrl,
    paramsSerializer,
    transformRequest: [convertRequest, ...axios.defaults.transformRequest],
    transformResponse: [...axios.defaults.transformResponse, convertResponse]
  })
  instance.interceptors.request.use(snakeParams)
  instance.interceptors.request.use(addAuthorizationToken)
  return instance
}

export default createRepository()
