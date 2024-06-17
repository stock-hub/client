import { createContext, useCallback, useEffect, useState } from 'react'
import productService from '../services/products.service'
import { Product, ProductContextProps } from '../types/product.type'

interface IProductResponse {
  products: Product[]
  total_pages: number
}

export const ProductContext = createContext<ProductContextProps>({
  productsList: [],
  page: 1,
  totalPages: 1,
  setProductsList: () => {},
  getProducts: () => {},
  changePage: () => {},
  deleteProduct: () => {}
})

export const ProductProviderWrapper = (props: { children: React.ReactNode }) => {
  const [productsList, setProductsList] = useState<Product[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const getProducts = useCallback(() => {
    productService
      .getProductsList(page)
      .then(({ data }: { data: IProductResponse }) => {
        setProductsList(data.products)
        setTotalPages(data.total_pages)
      })
      .catch((err: Error) => console.error(err))
  }, [page])

  const changePage = (num: number) => setPage(num)

  const deleteProduct = (productId: string) => {
    productService
      .deleteProduct(productId)
      .then(() => getProducts())
      .catch((err: Error) => console.error(err))
  }

  useEffect(() => {
    changePage(1)
    getProducts()
  }, [page, getProducts])

  return (
    <ProductContext.Provider
      value={{
        productsList,
        getProducts,
        changePage,
        page,
        totalPages,
        setProductsList,
        deleteProduct
      }}
    >
      {props.children}
    </ProductContext.Provider>
  )
}
