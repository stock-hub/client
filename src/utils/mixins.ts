import { css } from 'styled-components'

export const MobileContainer = css`
  width: 90%;
  margin: 0 auto;
`
export const Btn = css`
  display: block;
  width: 95%;
  padding: 1rem 0;
  margin: 0 auto;
  background: none;
  text-transform: uppercase;
  font-weight: 600;
  border: 1px solid black;
`

export const PrimaryBtn = css`
  border: 3px solid #ccc;
  color: white;
  border-radius: 5px;
  background-color: #ccc;
  transition: 0.1s ease-in;

  &:hover {
    background-color: #a5a5a5;
    border-color: #a5a5a5;
  }
`
