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

    useEffect(() => getProducts(), [page])
    useEffect(() => {
        changePage()
    }, [])

    return (
        <ProductContext.Provider value={{ productsList, getProducts, changePage, page, totalPages }}>
            {props.children}
        </ProductContext.Provider>
    )
}

export { ProductContext, ProductProviderWrapper }
