import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const EachProductDiv = styled.div`
  @media screen and (max-width: 480px) {
    .eachAdminProduct {
      text-align: center;
    }

    .eachAdminProduct a,
    .eachAdminProduct button {
      display: block;
      width: 100%;
      margin-bottom: 5px;
    }
  }
`

export const ProductImg = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
`

export const ActionLink = styled(Link)`
  width: 4.5rem;
  margin-bottom: 10px;
`
