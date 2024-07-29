import ReactDOM from 'react-dom/client'
import { App } from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProviderWrapper } from './context/auth.context'
import { MessageProviderWrapper } from './context/userMessage.context'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <AuthProviderWrapper>
    <Router>
      <MessageProviderWrapper>
        <App />
      </MessageProviderWrapper>
    </Router>
  </AuthProviderWrapper>
)
