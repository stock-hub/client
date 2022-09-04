import axios from 'axios'

class ProductService {
    constructor() {
        this.axios = axios.create({ baseURL: `${process.env.REACT_APP_API_URL}/products` })

        this.axios.interceptors.request.use((config) => {

            const storedToken = localStorage.getItem("authToken")

            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }

            return config
        })
    }

    getProductsList(page) {
        return this.axios.get(`/${page}`)
    }

    getProduct(productId) {
        return this.axios.get(`/${productId}/view`)
    }

    newProduct(product) {
        return this.axios.post('/new', product)
    }

    deleteProduct(productId) {
        return this.axios.delete(`/${productId}/delete`)
    }
}

const productService = new ProductService()

export default productService