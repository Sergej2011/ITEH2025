import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/api'

interface User { 
  id: number
  name: string
  email: string
  phone?: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      apiService.setToken(storedToken)
      // Fetch user data
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const userData = await apiService.getUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await apiService.login(email, password)
      const { user: userData, token: userToken } = response
      
      setUser(userData)
      setToken(userToken)
      localStorage.setItem('token', userToken)
      apiService.setToken(userToken)
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await apiService.register(name, email, password, phone)
      const { user: userData, token: userToken } = response
      
      setUser(userData)
      setToken(userToken)
      localStorage.setItem('token', userToken)
      apiService.setToken(userToken)
      
      return true
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw error // Re-throw error so component can handle it
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    apiService.setToken(null)
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true)
      await apiService.changePassword(currentPassword, newPassword)
      return true
    } catch (error) {
      console.error('Password change failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    changePassword,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
