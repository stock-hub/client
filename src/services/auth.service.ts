import axios, { AxiosRequestConfig } from 'axios'
interface ILoginPayload {
  username: string
  password: string
}
class AuthService {
  axios: any

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/admin`
    })

    this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
      const storedToken =
        localStorage.getItem('authToken') || sessionStorage.getItem('authToken')

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` }
      }

      return config
    })
  }

  login(payload: ILoginPayload) {
    return this.axios.post('/login', payload)
  }

  verify(token: string) {
    return this.axios.get('/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }
}

const authService = new AuthService()

export default authService
