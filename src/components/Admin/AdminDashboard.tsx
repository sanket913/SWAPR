import React from 'react';
import { Users, ArrowRightLeft, Star, TrendingUp, Activity, Calendar, Zap, Target, Globe, Sparkles } from 'lucide-react';
import { useSwapRequests, useUsers, useReviews } from '@/hooks/useData';
import { AdminStats } from '@/types';

interface AdminDashboardProps {
  onPageChange: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onPageChange }) => {
  const { swapRequests } = useSwapRequests();
  const { users } = useUsers();
  const { reviews } = useReviews();

  const stats: AdminStats = {
    totalUsers: users.filter(u => !u.isAdmin).length,
    totalSwaps: swapRequests.length,
    pendingSwaps: swapRequests.filter(r => r.status === 'pending').length,
    completedSwaps: swapRequests.filter(r => r.status === 'completed').length,
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0
  };

  const recentActivity = [
    ...swapRequests.slice(-5).map(request => ({
      id: request.id,
      type: 'swap_request',
      description: `New swap request: ${request.skillOffered} ↔ ${request.skillWanted}`,
      timestamp: request.createdAt,
      icon: '🔄',
      color: 'from-blue-500 to-cyan-500'
    })),
    ...reviews.slice(-5).map(review => ({
      id: review.id,
      type: 'review',
      description: `New review with ${review.rating} stars`,
      timestamp: review.createdAt,
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500'
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%',
      description: 'Active community members'
    },
    {
      title: 'Total Swaps',
      value: stats.totalSwaps.toLocaleString(),
      icon: ArrowRightLeft,
      gradient: 'from-green-500 to-emerald-500',
      change: '+8%',
      description: 'Skill exchanges completed'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingSwaps.toLocaleString(),
      icon: Activity,
      gradient: 'from-yellow-500 to-orange-500',
      change: '-3%',
      description: 'Awaiting approval'
    },
    {
      title: 'Completed Swaps',
      value: stats.completedSwaps.toLocaleString(),
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      change: '+15%',
      description: 'Successfully finished'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews.toLocaleString(),
      icon: Star,
      gradient: 'from-orange-500 to-red-500',
      change: '+22%',
      description: 'Community feedback'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      gradient: 'from-pink-500 to-rose-500',
      change: '+0.2',
      description: 'Platform satisfaction'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and moderate user accounts',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      page: 'admin-users',
      emoji: '👥'
    },
    {
      title: 'Monitor Swaps',
      description: 'Review ongoing skill exchanges',
      icon: ArrowRightLeft,
      gradient: 'from-green-500 to-emerald-500',
      page: 'admin-swaps',
      emoji: '🔄'
    },
    {
      title: 'Send Announcement',
      description: 'Broadcast platform updates',
      icon: Activity,
      gradient: 'from-purple-500 to-pink-500',
      page: 'admin-announcements',
      emoji: '📢'
    },
    {
      title: 'View Reports',
      description: 'Analytics and insights',
      icon: Calendar,
      gradient: 'from-orange-500 to-red-500',
      page: 'admin-reports',
      emoji: '📈'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 particle-bg">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-yellow-400/10 rounded-full blur-xl animate-float delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center animate-slide-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mb-6 animate-pulse-glow">
            <Target className="h-10 w-10 text-white animate-float" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="gradient-text-rainbow">Admin Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor platform activity, manage users, and drive community growth with powerful insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <div key={index} className={`glass-card rounded-3xl shadow-xl p-6 border-2 border-white/20 hover-lift animate-slide-in-up delay-${index * 100}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg animate-pulse-glow`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className={`text-right ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="text-sm font-black">{stat.change}</span>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-600">{stat.title}</p>
                <p className="text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="glass-card rounded-3xl shadow-xl border-2 border-white/20 animate-slide-in-left">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">🔥 Recent Activity</h2>
                  <p className="text-sm text-gray-600">Latest platform events</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-white/20 max-h-96 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-float" />
                  <p className="text-gray-600 font-semibold">No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={activity.id} className={`p-4 hover:bg-white/5 transition-colors duration-300 animate-slide-in-up delay-${index * 50}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 bg-gradient-to-br ${activity.color} rounded-xl shadow-lg flex-shrink-0`}>
                        <span className="text-sm">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 break-words">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          {new Date(activity.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-3xl shadow-xl border-2 border-white/20 animate-slide-in-right">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">⚡ Quick Actions</h2>
                  <p className="text-sm text-gray-600">Manage your platform</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {quickActions.map((action, index) => (
                <button 
                  key={action.page}
                  onClick={() => onPageChange(action.page)}
                  className={`w-full text-left p-4 glass-card hover:shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-105 hover-lift group animate-slide-in-up delay-${index * 100}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-gradient-to-br ${action.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-xl">{action.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 text-lg group-hover:gradient-text transition-all duration-300">{action.title}</h3>
                      <p className="text-sm text-gray-600 font-semibold">{action.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;