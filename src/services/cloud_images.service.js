import axios from "axios"

class CloudImagesService {
    constructor() {
        this.api = axios.create({
            baseURL: `${process.env.REACT_APP_API_URL}`,
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")

            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }

            return config
        })
    }

    uploadImage(imageForm) {
        return this.api.post("/upload_image", imageForm)
    }

    deleteImage(image_url) {
        return this.api.post(`/delete_image/&url=${encodeURIComponent(image_url)}`)
    }
}

const cloudImagesService = new CloudImagesService()

export default cloudImagesService