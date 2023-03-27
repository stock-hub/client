import React, { createContext, useState } from 'react'

interface IMessageContext {
  showMessage: boolean
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>
  messageInfo: string
  setMessageInfo: React.Dispatch<React.SetStateAction<string>>
}

export const MessageContext = createContext<IMessageContext>({
  showMessage: false,
  setShowMessage: () => {},
  messageInfo: '',
  setMessageInfo: () => {}
})

export const MessageProviderWrapper = (props: { children: React.ReactNode }) => {
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [messageInfo, setMessageInfo] = useState<string>('')

  const messageContextValue = {
    showMessage,
    setShowMessage,
    messageInfo,
    setMessageInfo
  }

  return <MessageContext.Provider value={messageContextValue}>{props.children}</MessageContext.Provider>
}
