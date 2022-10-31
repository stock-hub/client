import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { AuthProviderWrapper } from './context/auth.context'
import { ProductProviderWrapper } from './context/product.context'
import { MessageProviderWrapper } from './context/userMessage.context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Router>
    <AuthProviderWrapper>
      <MessageProviderWrapper>
        <ProductProviderWrapper>
          <App />
        </ProductProviderWrapper>
      </MessageProviderWrapper>
    </AuthProviderWrapper>
  </Router>
)