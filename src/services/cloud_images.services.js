import axios from "axios"

class UploadService {
    constructor() {
        this.api = axios.create({
            baseURL: `${process.env.REACT_APP_API_URL}/upload_image`,
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
        return this.api.post("/", imageForm)
    }
}

const uploadService = new UploadService()

export default uploadService