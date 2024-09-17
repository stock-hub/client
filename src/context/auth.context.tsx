import React, { createContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/auth.service'

interface User {
  username: string
  _id: string
  tags: string[]
}

interface AuthContextType {
  isLoggedIn: boolean
  isLoading: boolean
  rememberUser: boolean
  user: User | null
  setRememberUser: React.Dispatch<React.SetStateAction<boolean>>
  storeToken: (token: string) => void
  authenticateUser: () => Promise<void>
  logInUser: (username: string, password: string) => Promise<void>
  logOutUser: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  rememberUser: false,
  user: null,
  setRememberUser: () => {},
  storeToken: () => {},
  authenticateUser: async () => {},
  logInUser: async () => {},
  logOutUser: () => {}
})

interface LoginResponse {
  data: {
    authToken: string
  }
}

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

  const authenticateUser = useCallback(async () => {
    const storedToken = getToken()

    if (!storedToken) {
      logOutUser()
    } else {
      try {
        await authService.verify(storedToken)

        const { data: currentUser } = await authService.getUser(storedToken)

        setIsLoggedIn(true)
        setIsLoading(false)
        setUser(currentUser)
      } catch {
        logOutUser()
        setIsLoading(false)
      }
    }
  }, [])

  const logInUser = async (username: string, password: string) => {
    setIsLoading(true)

    try {
      const {
        data: { authToken }
      }: LoginResponse = await authService.login({ username, password })
      storeToken(authToken)
      await authenticateUser()
    } catch (err) {
      console.error(err)
      logOutUser()
    } finally {
      setIsLoading(false)
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
  }, [authenticateUser])

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
        logInUser,
        logOutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
