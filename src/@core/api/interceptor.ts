import axios from 'axios'

import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 1500000
})

axiosInstance.interceptors.request.use(
  config => {
    const token = Cookies.get('accessToken')
    const orgId = Cookies.get('org_id')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    if (orgId) {
      config.headers['organization_id'] = orgId
    }

    config.headers['Receiver'] = 'moondoor'

    return config
  },
  error => Promise.reject(error)
)

let isSessionExpired = false

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (!isSessionExpired && error.response && error.response.status === 401) {
      isSessionExpired = true
      toast.error('Error session expired please login again')

      Cookies.remove('accessToken')
      Cookies.remove('org_id')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
