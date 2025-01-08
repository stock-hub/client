/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/auth.service'
import { User } from '../types/user.type'
import { AxiosError } from 'axios'

interface AuthContextType {
  isLoggedIn: boolean
  isLoading: boolean
  rememberUser: boolean
  user: User | null
  authError: string | null
  showError: boolean
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
  authError: null,
  showError: false,
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
  const [authError, setAuthError] = useState<string | null>(null)
  const [showError, setShowError] = useState<boolean>(false)

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
      if (err instanceof AxiosError && err.response) {
        const { message } = err.response.data

        setAuthError(message)
        setShowError(true)
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const logOutUser = () => {
    removeToken()
    setIsLoggedIn(false)
    setIsLoading(false)
    setUser(null)
    setAuthError(null)
    setShowError(false)
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
        authError,
        showError,
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
