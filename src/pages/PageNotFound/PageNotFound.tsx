import React from 'react'
import styled from 'styled-components'

const PageNotaFoundDiv = styled.div`
  width: 50%;
  margin: 5rem auto;
  text-align: center;
`

export const PageNotFound: React.FC = () => {
  return (
    <PageNotaFoundDiv>
      <h1>404 This page does not exists!</h1>
      <img src='https://http.cat/404' alt='page not found' />
    </PageNotaFoundDiv>
  )
}
