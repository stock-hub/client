import React, { createContext, useState, useEffect } from 'react'
import authService from '../services/auth.service'

interface User {
  username: string
  _id: string
}

interface AuthContextType {
  isLoggedIn: boolean
  isLoading: boolean
  rememberUser: boolean
  user: User | null
  setRememberUser: React.Dispatch<React.SetStateAction<boolean>>
  storeToken: (token: string) => void
  authenticateUser: () => void
  logOutUser: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  rememberUser: false,
  user: null,
  setRememberUser: () => {},
  storeToken: () => {},
  authenticateUser: () => {},
  logOutUser: () => {}
})

export const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [rememberUser, setRememberUser] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  const storeToken = (token: string) => {
    rememberUser ? localStorage.setItem('authToken', token) : sessionStorage.setItem('authToken', token)
  }

  const removeToken = () => {
    rememberUser ? localStorage.removeItem('authToken') : sessionStorage.removeItem('authToken')
  }

  const getToken = (): string | null => {
    return rememberUser ? localStorage.getItem('authToken') : sessionStorage.getItem('authToken')
  }

  const authenticateUser = () => {
    const storedToken = getToken()

    if (!storedToken) {
      logOutUser()
    } else {
      authService
        .verify(storedToken)
        .then(({ data }: { data: User }) => {
          setIsLoggedIn(true)
          setIsLoading(false)
          setUser(data)
        })
        .catch(() => logOutUser())
    }
  }

  const logOutUser = () => {
    removeToken()
    setIsLoggedIn(false)
    setIsLoading(false)
    setUser(null)
  }

  useEffect(() => {
    authenticateUser()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        rememberUser,
        user,
        setRememberUser,
        storeToken,
        authenticateUser,
        logOutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
