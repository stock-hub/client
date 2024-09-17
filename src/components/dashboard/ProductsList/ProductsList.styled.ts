import { Form } from 'react-bootstrap'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
`

export const ProductPaginator = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`

export const ProductInputFilter = styled.input`
  width: 20%;
  display: inline-block;
`

export const ProductsFilter = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;

  & button {
    margin: 1rem;
  }

  & input {
    width: 100%;
    margin: 0;
  }
`

export const ProductsListDiv = styled.div`
  width: 100%;
  margin-left: 6rem;
`

export const FormCheck = styled(Form.Check)`
  & input {
    cursor: pointer;
  }
`
