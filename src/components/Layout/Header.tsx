'use client'

import React, { useState } from 'react'
import { Menu, X, User, Bell, Search, LogOut, Sparkles, Zap, Heart } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/hooks/useData'

interface HeaderProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const { notifications } = useNotifications()

  const unreadCount = notifications.filter(n => !n.isRead && n.userId === currentUser?.id).length

  const navigation = currentUser?.isAdmin ? [
    { name: 'Dashboard', id: 'admin-dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Users', id: 'admin-users', icon: '👥', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Swaps', id: 'admin-swaps', icon: '🔄', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Reports', id: 'admin-reports', icon: '📈', gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Announcements', id: 'admin-announcements', icon: '📢', gradient: 'from-red-500 to-rose-500' }
  ] : [
    { name: 'Browse', id: 'browse', icon: '🔍', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'My Swaps', id: 'swaps', icon: '🤝', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Profile', id: 'profile', icon: '👤', gradient: 'from-purple-500 to-pink-500' }
  ]

  return (
    <header className="glass-card shadow-2xl sticky top-0 z-50 border-b-2 border-white/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onPageChange('home')}
              className="group flex items-center hover:scale-105 transition-all duration-300"
            >
              <Image
                src="/logo.png"
                alt="Swapr"
                width={200}
                height={60}
                className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[200px] object-contain group-hover:scale-110 transition-transform duration-300"
                onError={() => {
                  // Fallback handled by Next.js Image component
                }}
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          {currentUser && (
            <nav className="hidden lg:flex space-x-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`group relative px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    currentPage === item.id
                      ? `text-white bg-gradient-to-r ${item.gradient} shadow-xl animate-pulse-glow`
                      : 'text-gray-700 hover:text-white glass-card hover:shadow-lg'
                  }`}
                >
                  <span className="flex items-center space-x-2 relative z-10">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  {currentPage !== item.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  )}
                </button>
              ))}
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                {/* Search */}
                <button
                  onClick={() => onPageChange('browse')}
                  className="group p-3 text-gray-400 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-blue-50 transform hover:scale-110 glass-card"
                  title="Search Skills"
                >
                  <Search className="h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
                </button>

                {/* Notifications */}
                <button
                  onClick={() => onPageChange('notifications')}
                  className="group relative p-3 text-gray-400 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-blue-50 transform hover:scale-110 glass-card"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-black animate-bounce shadow-lg">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile */}
                <button
                  onClick={() => onPageChange('profile')}
                  className="group hidden sm:flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-300 glass-card rounded-2xl px-4 py-2 hover:shadow-lg transform hover:scale-105 border-2 border-white/20"
                >
                  <div className="relative">
                    {currentUser.profilePhoto ? (
                      <Image
                        src={currentUser.profilePhoto}
                        alt={currentUser.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-xl object-cover border-2 border-white shadow-lg group-hover:border-blue-200 transition-all duration-300 animate-pulse-glow"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="font-black text-sm truncate max-w-24">{currentUser.name}</div>
                    <div className="text-xs text-gray-500 font-semibold">View Profile</div>
                  </div>
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="group hidden sm:block p-3 text-gray-400 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-red-50 transform hover:scale-110 glass-card"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-3 text-gray-400 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-blue-50 transform hover:scale-110 glass-card"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
                  ) : (
                    <Menu className="h-6 w-6 transition-transform duration-300" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onPageChange('login')}
                  className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transform hover:scale-105 glass-card"
                >
                  Login
                </button>
                <button
                  onClick={() => onPageChange('register')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-2xl transition-all duration-300 font-black transform hover:scale-105 animate-pulse-glow relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Join Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && currentUser && (
          <div className="lg:hidden border-t border-white/20 glass-card shadow-2xl animate-slide-in-down">
            <div className="py-6 space-y-2 px-4">
              {/* Mobile Profile */}
              <div className="sm:hidden flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl mb-4 animate-bounce-in">
                <div className="relative">
                  {currentUser.profilePhoto ? (
                    <Image
                      src={currentUser.profilePhoto}
                      alt={currentUser.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="font-black text-gray-900">{currentUser.name}</div>
                  <div className="text-sm text-gray-600 font-semibold">Tap to view profile</div>
                </div>
              </div>
              
              {navigation.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-2xl text-base font-bold transition-all duration-300 animate-slide-in-left delay-${index * 100} ${
                    currentPage === item.id
                      ? `text-white bg-gradient-to-r ${item.gradient} shadow-xl`
                      : 'text-gray-700 hover:text-white glass-card hover:shadow-lg'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                  {currentPage !== item.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300`}></div>
                  )}
                </button>
              ))}
              
              {/* Mobile Logout */}
              <div className="pt-4 border-t border-white/20">
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-2xl text-base font-bold text-red-600 hover:bg-red-50 transition-all duration-300 glass-card animate-slide-in-left delay-500"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header