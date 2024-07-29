import React, { useCallback, useEffect, useState } from 'react'
import { Spinner, Button, ButtonGroup } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import EachProduct from '../EachProduct/EachProduct'
import productService from '../../../services/products.service'
import { Product } from '../../../types/product.type'
import styled from 'styled-components'

const ProductPaginator = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`

const ProductInputFilter = styled.input`
  width: 20%;
  display: inline-block;
`

const ProductsFilter = styled.div`
  margin-bottom: 2rem;

  & button {
    margin-left: 1rem;
  }
`

interface IProductResponse {
  products: Product[]
  total_pages: number
}

export const ProductsList: React.FC = () => {
  const [pageParams, setPageParams] = useSearchParams()
  const [productsList, setProductsList] = useState<Product[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [buttonSearch, setButtonSearch] = useState<string>('')
  const pageNumber: number | string = Number(pageParams.get('page')) || 1

  const firstPage = () => {
    setPageParams({ page: '1' })
    window.scrollTo(0, 0)
  }

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageParams({ page: (pageNumber - 1).toString() })
      window.scrollTo(0, 0)
    }
  }

  const nextPage = () => {
    if (pageNumber < totalPages) {
      setPageParams({ page: (pageNumber + 1).toString() })
      window.scrollTo(0, 0)
    }
  }

  const lastPage = () => {
    setPageParams({ page: totalPages.toString() })
    window.scrollTo(0, 0)
  }

  const getProducts = useCallback(() => {
    productService
      .getProductsList(page)
      .then(({ data }: { data: IProductResponse }) => {
        setProductsList(data.products)
        setTotalPages(data.total_pages)
      })
      .catch((err: Error) => console.error(err))
  }, [page])

  useEffect(() => {
    getProducts()
  }, [page])

  const changePage = (num: number) => setPage(num)

  const getFilteredProducts = useCallback(() => {
    if (buttonSearch !== '') {
      productService
        .getAllProducts(buttonSearch)
        .then(({ data }: { data: Product[] }) => {
          setProductsList(data)
        })
        .catch((err: Error) => console.error(err))
    } else {
      getProducts()
    }
  }, [buttonSearch, getProducts, setProductsList])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const setSearchQuery = () => setButtonSearch(query)

  const resetFilter = useCallback(() => {
    setQuery('')
    setButtonSearch('')
    getProducts()
  }, [getProducts])

  useEffect(() => {
    changePage(pageNumber)
  }, [changePage, pageNumber])

  useEffect(() => {
    getFilteredProducts()
  }, [buttonSearch, getFilteredProducts])

  return (
    <>
      <ProductsFilter>
        <ProductInputFilter
          className="form-control"
          type="text"
          placeholder="Buscar producto"
          onChange={handleInputChange}
          value={query}
        />
        <button className="btn btn-outline-primary" onClick={setSearchQuery}>
          Buscar
        </button>
        <button className="btn btn-outline-primary" onClick={resetFilter}>
          Limpiar filtros
        </button>
      </ProductsFilter>
      {productsList.length !== 0 ? (
        <>
          {productsList.map((product, idx) => {
            return <EachProduct key={idx} product={product} />
          })}
          <br />
          <ProductPaginator>
            <ButtonGroup aria-label="Basic example">
              <Button variant="outline-primary" onClick={firstPage}>
                {'<<'}
              </Button>
              <Button variant="outline-primary" onClick={prevPage}>
                {'<'}
              </Button>
              <Button variant="outline-primary" onClick={nextPage}>
                {'>'}
              </Button>
              <Button variant="outline-primary" onClick={lastPage}>
                {'>>'}
              </Button>
            </ButtonGroup>
          </ProductPaginator>
        </>
      ) : (
        <Spinner animation="border" variant="info" />
      )}
    </>
  )
}
