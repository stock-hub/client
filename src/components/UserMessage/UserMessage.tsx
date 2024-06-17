import React, { useContext } from 'react'
import { MessageContext } from '../../context/userMessage.context'
import styled from 'styled-components'

const UserMessageDiv = styled.div`
  background-color: #ff5050;
  color: white;
  font-weight: 700;
  text-align: center;
  padding: 0.5rem 0;
  margin-top: 10px;
  width: auto;
  border-radius: 5px;
`

export const UserMessage: React.FC = () => {
  const { showMessage, messageInfo } = useContext(MessageContext)

  return (
    <div style={{ display: `${showMessage ? 'block' : 'none'}` }}>
      <UserMessageDiv>
        <p>{messageInfo}</p>
      </UserMessageDiv>
    </div>
  )
}
