import { Spinner, Button, ButtonGroup } from 'react-bootstrap'
import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EachProduct from '../EachProduct/EachProduct'
import { ProductContext } from '../../../context/product.context'
import './ProductList.css'
import productService from '../../../services/products.service'

const ProductList = () => {
    const [pageParams, setPageParams] = useSearchParams()
    const { productsList, changePage, totalPages, setProductsList, getProducts } = useContext(ProductContext)
    const [query, setQuery] = useState('')
    const [buttonSearch, setButtonSearch] = useState('')
    let pageNumber = pageParams.get("page")

    const firstPage = () => {
        pageNumber = 1
        setPageParams({ page: pageNumber })
        window.scrollTo(0, 0)
    }

    const prevPage = () => {
        if (pageNumber > 1) {
            pageNumber--
            setPageParams({ page: pageNumber })
            window.scrollTo(0, 0)
        }
    }

    const nextPage = () => {
        if (pageNumber < totalPages) {
            pageNumber++
            setPageParams({ page: pageNumber })
            window.scrollTo(0, 0)
        }
    }

    const lastPage = () => {
        pageNumber = totalPages
        setPageParams({ page: pageNumber })
        window.scrollTo(0, 0)
    }

    const getFilteredProducts = () => {
        if (buttonSearch !== '') {
            productService
                .getAllProducts(buttonSearch)
                .then(({ data }) => {
                    setProductsList(data)
                })
                .catch(err => console.log(err))
        } else {
            return []
        }
    }

    const handleInputChange = e => setQuery(e.target.value)

    const setSearchQuery = () => setButtonSearch(query)

    const resetFilter = () => {
        setQuery('')
        setButtonSearch('')
        getProducts()
    }

    useEffect(() => {
        changePage(pageNumber) // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber])

    useEffect(() => {
        getFilteredProducts() // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buttonSearch])

    useEffect(() => {
        resetFilter() // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='productsFilter'>
                <input
                    className='productInputFilter form-control'
                    type="text"
                    placeholder='Buscar producto'
                    onChange={handleInputChange}
                    value={query}
                />
                <button className='btn btn-outline-primary' onClick={setSearchQuery}>Buscar</button>
                <button className='btn btn-outline-primary' onClick={resetFilter}>Limpiar filtros</button>
            </div>
            {
                productsList.length !== 0
                    ?
                    <>
                        {
                            productsList.map((product, idx) => {
                                return (
                                    <EachProduct key={idx} product={product} />
                                )
                            })
                        }
                        <br />
                        <div className='productPaginator'>
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="outline-primary"
                                    onClick={firstPage}>{"<<"}</Button>
                                <Button variant="outline-primary"
                                    onClick={prevPage}>Anterior</Button>
                                <Button variant="outline-primary"
                                    onClick={nextPage}>Siguiente</Button>
                                <Button variant="outline-primary"
                                    onClick={lastPage}>{">>"}</Button>
                            </ButtonGroup>
                        </div>
                    </>
                    :
                    <Spinner animation="border" variant="info" />
            }
        </>
    )
}

export default ProductList