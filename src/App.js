import './App.css'
import Footer from './components/Footer/Footer'
import NavBar from './components/NavBar/NavBar'
import UserMessage from './components/UserMessage/UserMessage'
import AppRoutes from './routes/AppRoutes'

function App() {
  const excludedRoute = '/'

  return (
    <>
      {!excludedRoute.includes(window.location.pathname) && <NavBar />}
      <AppRoutes />
      <UserMessage />
      {!excludedRoute.includes(window.location.pathname) && <Footer />}
    </>
  )
}

export default App
