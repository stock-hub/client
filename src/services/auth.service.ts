import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { User } from '../types/user.type'
interface LoginPayload {
  username: string
  password: string
}
class AuthService {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/admin`
    })

    this.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')

      if (storedToken) {
        if (config.headers instanceof AxiosHeaders) {
          config.headers.set('Authorization', `Bearer ${storedToken}`)
        } else {
          config.headers = new AxiosHeaders()
          config.headers.set('Authorization', `Bearer ${storedToken}`)
        }
      }

      return config
    })
  }

  login(payload: LoginPayload) {
    return this.axios.post('/login', payload)
  }

  verify(token: string) {
    return this.axios.get('/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  sign() {
    return this.axios.post('/login')
  }

  getUser(token: string) {
    return this.axios.get('/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  requestChangePassword(email: string) {
    return this.axios.post(`/change_password/request/${email}`)
  }

  changePassword(payload: { password: string; hash: string }) {
    return this.axios.post(`/change_password/${payload.hash}`, { new_password: payload.password })
  }

  updateUser(payload: Partial<User>) {
    return this.axios.put('/update', payload)
  }
}

const authService = new AuthService()

export default authService
