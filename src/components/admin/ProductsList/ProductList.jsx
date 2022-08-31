import { Spinner, Button, ButtonGroup } from 'react-bootstrap'
import { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import EachProduct from '../EachProduct/EachProduct'
import { ProductContext } from '../../../context/product.context'

const ProductList = () => {
    const [pageParams, setPageParams] = useSearchParams()
    const { productsList, changePage, totalPages } = useContext(ProductContext)
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

    useEffect(() => changePage(pageNumber), [pageNumber])

    return (
        <>
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
                        <div>
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