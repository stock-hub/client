import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { Employee } from '../types/employee.type'

class EmployeeService {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/employees`
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

  newEmployee(employee: Employee) {
    return this.axios.post<Employee>('/new', employee)
  }

  deleteEmployee(employeeId: string) {
    return this.axios.delete(`/${employeeId}/delete`)
  }
}

const employeeService = new EmployeeService()

export default employeeService
