'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '@/lib/api'
import { User } from '@/types'

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (userData: any) => Promise<void>
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
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await apiService.getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error('Failed to get current user:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password)
      setCurrentUser(response.user)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await apiService.register(userData)
      setCurrentUser(response.user)
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setCurrentUser(null)
    }
  }

  const updateProfile = async (userData: any): Promise<void> => {
    try {
      const updatedUser = await apiService.updateProfile(userData)
      const transformedUser = {
        ...updatedUser,
        skillsOffered: Array.isArray(updatedUser.skillsOffered) ? updatedUser.skillsOffered : [],
        skillsWanted: Array.isArray(updatedUser.skillsWanted) ? updatedUser.skillsWanted : [],
        availability: Array.isArray(updatedUser.availability) ? updatedUser.availability : []
      }
      setCurrentUser(transformedUser)
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}