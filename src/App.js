import './App.css'
import Footer from './components/Footer/Footer'
import NavBar from './components/NavBar/NavBar'
import UserMessage from './components/UserMessage/UserMessage'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <NavBar />
      <AppRoutes />
      <UserMessage />
      <Footer />
    </>
  )
}

export default App
