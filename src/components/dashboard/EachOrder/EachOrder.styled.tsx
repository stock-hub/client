import styled from 'styled-components'

export const Container = styled.div<{ $download: boolean }>`
  width: 80%;
  margin: ${({ $download }) => ($download ? `0 0` : `4rem auto`)};
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75);

  & p {
    font-family: 'Montserrat', sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }
`

export const Header = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  & img {
    width: 30%;
  }

  & div {
    width: 30%;
  }
`

export const Divider = styled.hr`
  width: 90%;
  border: none;
  border-top: 2px solid #ccc;
  margin: 10px auto;
`

export const UsersInfo = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem;

  & p {
    margin: 0;
  }
`

export const CompanyAddress = styled.p`
  width: 100%;
`

export const OrderDetails = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  padding: 1rem;

  & p {
    margin-right: 2rem;
  }
`

export const OrderProducts = styled.table`
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;

  & th,
  td {
    padding: 10px;
    text-align: left;
  }

  & th {
    background-color: #f8f8f8;
  }
`

export const Footer = styled.footer`
  position: relative;
  bottom: 0;
  width: 100%;
  text-align: center;
  margin-top: 1rem;
  padding-bottom: 1rem;

  & a {
    text-decoration: none;
    color: black;
  }
`
