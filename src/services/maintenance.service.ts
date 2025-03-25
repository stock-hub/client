import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { Maintenance } from '../types/maintenance.type'

class MaintenanceService {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/maintenances`
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

  newMaintenance(maintenance: Maintenance) {
    return this.axios.post<Maintenance>('/new', maintenance)
  }

  deleteMaintenance(maintenanceId: string) {
    return this.axios.delete(`/${maintenanceId}/delete`)
  }

  editMaintenance(maintenanceId: string, maintenance: Maintenance) {
    return this.axios.put(`/${maintenanceId}/edit`, maintenance)
  }
}

const maintenanceService = new MaintenanceService()

export default maintenanceService
