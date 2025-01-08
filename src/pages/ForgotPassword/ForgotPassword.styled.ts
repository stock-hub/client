import styled from 'styled-components'
import { Btn, PrimaryBtn } from '../../utils/mixins'

export const SubmitBtn = styled.button`
  ${Btn}
  ${PrimaryBtn}
`

export const SuccessEmail = styled.div`
  border: none;
  background-color: #ccc;
  padding: 10px 8px;

  & p {
    margin: 0;
  }
`

export const Input = styled.input`
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    box-shadow: 0 0 0px 1000px white inset !important;
    -webkit-text-fill-color: black !important;
    caret-color: black !important;
  }

  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    box-shadow: 0 0 0px 1000px white inset !important;
    -webkit-text-fill-color: black !important;
    caret-color: black !important;
  }
`
