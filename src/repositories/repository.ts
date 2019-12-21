import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosTransformer
} from 'axios'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'
import Cookies from 'js-cookie'
import qs from 'qs'

const snakeParams = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (config.params) {
    config.params = snakecaseKeys(config.params)
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

const convertResponse = (data: any, headers?: any): any => {
  if (headers) {
    Object.assign(headers, camelcaseKeys(headers, { deep: true }))
  }
  return data ? camelcaseKeys(data, { deep: true }) : data
}

const convertRequest = (data: any, _headers?: any): any => {
  return data ? snakecaseKeys(data) : data
}

const paramsSerializer = (params: any) => {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}

const defaultTransformRequest = (): AxiosTransformer[] => {
  const { transformRequest } = axios.defaults
  if (!transformRequest) {
    return []
  } else if (Array.isArray(transformRequest)) {
    return transformRequest
  } else {
    return [transformRequest]
  }
}

const defaultTransformResponse = (): AxiosTransformer[] => {
  const { transformResponse } = axios.defaults
  if (!transformResponse) {
    return []
  } else if (Array.isArray(transformResponse)) {
    return transformResponse
  } else {
    return [transformResponse]
  }
}

const createRepository = (): AxiosInstance => {
  const baseUrl = process.client
    ? process.env.CLIENT_API_BASE_URL
    : process.env.SERVER_API_BASE_URL

  const instance = axios.create({
    baseURL: baseUrl,
    paramsSerializer,
    transformRequest: [convertRequest, ...defaultTransformRequest()],
    transformResponse: [...defaultTransformResponse(), convertResponse]
  })
  instance.interceptors.request.use(snakeParams)
  instance.interceptors.request.use(addAuthorizationToken)
  return instance
}

export default createRepository()
