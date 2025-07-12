'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'

// Users hook
export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (params: any = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getUsers(params)
      const transformedUsers = (response.users || []).map((user: any) => ({
        ...user,
        skillsOffered: Array.isArray(user.skillsOffered) ? user.skillsOffered : [],
        skillsWanted: Array.isArray(user.skillsWanted) ? user.skillsWanted : [],
        availability: Array.isArray(user.availability) ? user.availability : []
      }))
      setUsers(transformedUsers)
      return response
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch users:', err)
      return { users: [], pagination: null }
    } finally {
      setLoading(false)
    }
  }, [])

  const searchUsers = useCallback(async (query: string, skillType?: 'offered' | 'wanted') => {
    const params: any = { search: query }
    if (skillType) params.skillType = skillType
    
    const response = await fetchUsers(params)
    return response.users || []
  }, [fetchUsers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { 
    users, 
    loading, 
    error, 
    searchUsers, 
    refetch: fetchUsers 
  }
}

// Swap Requests hook
export const useSwapRequests = () => {
  const [swapRequests, setSwapRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSwapRequests = useCallback(async (params: any = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getSwaps(params)
      setSwapRequests(response.swaps || [])
      return response
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch swap requests:', err)
      return { swaps: [], pagination: null }
    } finally {
      setLoading(false)
    }
  }, [])

  const createSwapRequest = useCallback(async (swapData: any) => {
    try {
      const newSwap = await apiService.createSwap(swapData)
      setSwapRequests(prev => [newSwap, ...prev])
      return newSwap
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to create swap request:', err)
      throw err
    }
  }, [])

  const updateSwapRequest = useCallback(async (id: string, updates: any) => {
    try {
      const updatedSwap = await apiService.updateSwap(id, updates)
      setSwapRequests(prev => 
        prev.map(swap => swap._id === id ? updatedSwap : swap)
      )
      return updatedSwap
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to update swap request:', err)
      throw err
    }
  }, [])

  const deleteSwapRequest = useCallback(async (id: string) => {
    try {
      await apiService.deleteSwap(id)
      setSwapRequests(prev => prev.filter(swap => swap._id !== id))
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to delete swap request:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchSwapRequests()
  }, [fetchSwapRequests])

  return {
    swapRequests,
    loading,
    error,
    createSwapRequest,
    updateSwapRequest,
    deleteSwapRequest,
    refetch: fetchSwapRequests
  }
}

// Reviews hook
export const useReviews = () => {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserReviews = useCallback(async (userId: string, params: any = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getUserReviews(userId, params)
      setReviews(response.reviews || [])
      return response
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch reviews:', err)
      return { reviews: [], pagination: null }
    } finally {
      setLoading(false)
    }
  }, [])

  const createReview = useCallback(async (reviewData: any) => {
    try {
      const newReview = await apiService.createReview(reviewData)
      setReviews(prev => [newReview, ...prev])
      return newReview
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to create review:', err)
      throw err
    }
  }, [])

  const fetchGivenReviews = useCallback(async (params: any = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getGivenReviews(params)
      return response
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch given reviews:', err)
      return { reviews: [], pagination: null }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    reviews,
    loading,
    error,
    createReview,
    fetchUserReviews,
    fetchGivenReviews
  }
}

// Notifications hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (params: any = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getNotifications(params)
      setNotifications(response.notifications || [])
      setUnreadCount(response.unreadCount || 0)
      return response
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch notifications:', err)
      return { notifications: [], unreadCount: 0, pagination: null }
    } finally {
      setLoading(false)
    }
  }, [])

  const createNotification = useCallback(async (notificationData: any) => {
    console.log('Notification would be created:', notificationData)
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await apiService.markNotificationRead(id)
      setNotifications(prev => 
        prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to mark notification as read:', err)
      throw err
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await apiService.markAllNotificationsRead()
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
      setUnreadCount(0)
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to mark all notifications as read:', err)
      throw err
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await apiService.deleteNotification(id)
      setNotifications(prev => prev.filter(notif => notif._id !== id))
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to delete notification:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  }
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAdminUsers = useCallback(async (params: any = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getAdminUsers(params)
      setUsers(response.users || [])
      return response
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch admin users:', err)
      return { users: [], pagination: null }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (id: string, userData: any) => {
    try {
      const updatedUser = await apiService.updateAdminUser(id, userData)
      setUsers(prev => 
        prev.map(user => user._id === id ? updatedUser : user)
      )
      return updatedUser
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to update user:', err)
      throw err
    }
  }, [])

  const deleteUser = useCallback(async (id: string) => {
    try {
      await apiService.deleteAdminUser(id)
      setUsers(prev => prev.filter(user => user._id !== id))
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to delete user:', err)
      throw err
    }
  }, [])

  return {
    users,
    loading,
    error,
    fetchAdminUsers,
    updateUser,
    deleteUser
  }
}

export const useAdminSwaps = () => {
  const [swaps, setSwaps] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAdminSwaps = useCallback(async (params: any = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getAdminSwaps(params)
      setSwaps(response.swaps || [])
      return response
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch admin swaps:', err)
      return { swaps: [], pagination: null }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    swaps,
    loading,
    error,
    fetchAdminSwaps
  }
}