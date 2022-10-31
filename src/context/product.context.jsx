import { createContext, useEffect, useState } from 'react'
import productService from '../services/products.service'

const ProductContext = createContext()

function ProductProviderWrapper(props) {
    const [productsList, setProductsList] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const getProducts = () => {
        productService
            .getProductsList(page)
            .then(({ data }) => {
                setProductsList(data.products)
                setTotalPages(data.total_pages)
            })
            .catch(err => console.log(err))
    }

    const changePage = num => setPage(num)

    const deleteProduct = (id) => {
        productService
            .deleteProduct(id)
            .then(() => getProducts())
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getProducts() // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])
    useEffect(() => changePage(), [])

    return (
        <ProductContext.Provider value={{ productsList, getProducts, changePage, page, totalPages, setProductsList, deleteProduct }}>
            {props.children}
        </ProductContext.Provider>
    )
}

export { ProductContext, ProductProviderWrapper }
