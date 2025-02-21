import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

class CloudImagesService {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/images`
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

  uploadImages(imageForm: FormData) {
    return this.axios.post('/upload_images', imageForm)
  }

  uploadImage(imageForm: FormData) {
    return this.axios.post('/upload_image', imageForm)
  }

  deleteImage(image_url: string) {
    return this.axios.post(`/delete_image/&url=${encodeURIComponent(image_url)}`)
  }
}

const cloudImagesService = new CloudImagesService()

export default cloudImagesService
