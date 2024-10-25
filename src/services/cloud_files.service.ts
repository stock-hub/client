import axios, { AxiosRequestConfig } from 'axios'

class CloudFilesService {
  axios: any
  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/files`
    })

    this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` }
      }

      return config
    })
  }

  uploadFile(fileForm: FormData) {
    return this.axios.post('/upload_file', fileForm)
  }

  downloadFile(filename: string) {
    return this.axios.get(`/download/${filename}`, {
      responseType: 'blob'
    })
  }

  deleteFile(filename: string) {
    return this.axios.delete(`/delete/${filename}`)
  }
}

const cloudFilesService = new CloudFilesService()

export default cloudFilesService
