import axios from 'axios'

class AuthService {
    constructor() {
        this.axios = axios.create({ baseURL: `${process.env.REACT_APP_API_URL}/admin` })

        this.axios.interceptors.request.use((config) => {

            const storedToken = localStorage.getItem("authToken")

            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }

            return config
        })
    }

    login(info) {
        return this.axios.post('/login', info)
    }

    verify(token) {
        return this.axios.get('/verify', { headers: { Authorization: `Bearer ${token}` } })
    }
}

const authService = new AuthService()

export default authService