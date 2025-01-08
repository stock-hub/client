import styled from 'styled-components'

export const LoginFormError = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;

  & p {
    margin: 0;
    padding: 0.5rem;
  }
`

export const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`
