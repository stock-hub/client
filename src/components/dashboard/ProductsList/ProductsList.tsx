import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import EachProduct from '../EachProduct/EachProduct'
import productService from '../../../services/products.service'
import { Product, ProductListResponse } from '../../../types/product.type'
import {
  Container,
  FormCheck,
  ProductInputFilter,
  ProductPaginator,
  ProductsFilter,
  ProductsListDiv
} from './ProductsList.styled'
import { AuthContext } from '../../../context/auth.context'
import { titleize } from '../../../utils/tools'

export const ProductsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productsList, setProductsList] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [query, setQuery] = useState<string>(searchParams.get('query') || '')
  const [queryTags, setQueryTags] = useState<string>(searchParams.get('tags') || '')
  const [filterTrigger, setFilterTrigger] = useState<boolean>(false)
  const [checkedTags, setCheckedTags] = useState<{ [key: string]: boolean }>({})
  const page = Number(searchParams.get('page')) || 1
  const { user } = useContext(AuthContext)

  const fetchProducts = useCallback((page: number, query: string, tags: string) => {
    productService
      .getProductsList(page, query, tags.split(' ').join(','))
      .then(({ data }: { data: ProductListResponse }) => {
        setProductsList(data.products)
        setTotalPages(data.total_pages)
      })
      .catch((error: Error) => console.error(error))
  }, [])

  useEffect(() => {
    fetchProducts(page, query, queryTags)
  }, [fetchProducts, page, filterTrigger])

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), query })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    let activeTags = queryTags.split(' ')

    if (checked) {
      activeTags.push(name)
    } else {
      activeTags = activeTags.filter((tag) => tag !== name)
    }

    setQueryTags(activeTags.join(' ').trim())
    setCheckedTags((prevState) => ({
      ...prevState,
      [name]: checked
    }))
  }

  const handleSearch = () => {
    setFilterTrigger(!filterTrigger)
    setSearchParams({ page: '1', query, tags: queryTags })
  }

  const resetFilter = () => {
    setQuery('')
    setQueryTags('')
    setCheckedTags({})
    setSearchParams({ page: '1' })
    setFilterTrigger(!filterTrigger)
  }

  return (
    <>
      <Container>
        <ProductsFilter>
          <button className="btn btn-warning" onClick={resetFilter}>
            Limpiar filtros
          </button>
          <ProductInputFilter
            className="form-control"
            type="text"
            placeholder="Buscar producto"
            onChange={handleInputChange}
            value={query}
          />
          <button className="btn btn-outline-primary" onClick={handleSearch}>
            Buscar
          </button>
          <div>
            <p>Filtrar por etiqueta:</p>
            <div>
              <ul>
                {user?.tags.map((tag, idx) => {
                  return (
                    <FormCheck
                      type="switch"
                      label={titleize(tag)}
                      name={tag}
                      key={idx}
                      checked={checkedTags[tag] || false}
                      onChange={handleCheckboxChange}
                    />
                  )
                })}
              </ul>
            </div>
          </div>
        </ProductsFilter>
        {productsList.length !== 0 ? (
          <ProductsListDiv>
            {productsList.map((product, idx) => (
              <EachProduct key={idx} product={product} />
            ))}
          </ProductsListDiv>
        ) : (
          <p>La lista de productos está vacía</p>
        )}
      </Container>
      <ProductPaginator>
        <ButtonGroup aria-label="Basic example">
          <Button variant="outline-primary" onClick={() => handlePageChange(1)}>
            {'<<'}
          </Button>
          <Button variant="outline-primary" onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}>
            {'<'}
          </Button>
          <Button variant="outline-primary" onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}>
            {'>'}
          </Button>
          <Button variant="outline-primary" onClick={() => handlePageChange(totalPages)}>
            {'>>'}
          </Button>
        </ButtonGroup>
      </ProductPaginator>
    </>
  )
}
