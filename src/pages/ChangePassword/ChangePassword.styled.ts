import styled from 'styled-components'
import { Btn, PrimaryBtn } from '../../utils/mixins'

export const SubmitBtn = styled.button`
  ${Btn}
  ${PrimaryBtn}
`

export const ChangePasswordGroup = styled.div`
  display: flex;
`

export const ChangePasswordDiv = styled.div`
  width: 100%;
`

export const ChangePasswordInput = styled.input`
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`

export const ShowPasswordButton = styled.button`
  border: 1px solid #ced4da;
  border-left: none;
  background: none;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.374rem;
  padding-right: 0.5rem;
`

export const NotMatchPass = styled.p`
  color: red;
  text-align: left;
  margin-bottom: 1rem;
`
