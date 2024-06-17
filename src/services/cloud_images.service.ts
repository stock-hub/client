import axios, { AxiosRequestConfig } from 'axios'

class CloudImagesService {
  axios: any
  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}`
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

  uploadImage(imageForm: FormData) {
    return this.axios.post('/upload_image', imageForm)
  }

  deleteImage(image_url: string) {
    return this.axios.post(
      `/delete_image/&url=${encodeURIComponent(image_url)}`
    )
  }
}

const cloudImagesService = new CloudImagesService()

export default cloudImagesService
