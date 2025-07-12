import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, ArrowRightLeft, Star, Calendar, Download, Filter } from 'lucide-react';
import { useSwapRequests, useUsers, useReviews } from '@/hooks/useData';

const AdminReportsPage: React.FC = () => {
  const { swapRequests } = useSwapRequests();
  const { users } = useUsers();
  const { reviews } = useReviews();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const getDateRangeStart = () => {
    const now = new Date();
    switch (dateRange) {
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  };

  const filterByDateRange = (items: any[], dateField: string) => {
    const startDate = getDateRangeStart();
    return items.filter(item => new Date(item[dateField]) >= startDate);
  };

  const filteredUsers = filterByDateRange(users.filter(u => !u.isAdmin), 'joinedDate');
  const filteredSwaps = filterByDateRange(swapRequests, 'createdAt');
  const filteredReviews = filterByDateRange(reviews, 'createdAt');

  // Calculate metrics
  const metrics = {
    totalUsers: users.filter(u => !u.isAdmin).length,
    newUsers: filteredUsers.length,
    totalSwaps: swapRequests.length,
    newSwaps: filteredSwaps.length,
    completedSwaps: swapRequests.filter(s => s.status === 'completed').length,
    successRate: swapRequests.length > 0 
      ? Math.round((swapRequests.filter(s => s.status === 'completed').length / swapRequests.length) * 100)
      : 0,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
    totalReviews: reviews.length,
    newReviews: filteredReviews.length
  };

  // Popular skills analysis
  const skillsOffered = users.flatMap(u => u.skillsOffered);
  const skillsWanted = users.flatMap(u => u.skillsWanted);
  
  const skillCounts = [...skillsOffered, ...skillsWanted].reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularSkills = Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // User growth data (simplified)
  const getUserGrowthData = () => {
    const days = [];
    const now = new Date();
    const startDate = getDateRangeStart();
    
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dayUsers = users.filter(u => 
        !u.isAdmin && new Date(u.joinedDate).toDateString() === d.toDateString()
      ).length;
      
      days.push({
        date: d.toLocaleDateString(),
        users: dayUsers
      });
    }
    
    return days.slice(-7); // Show last 7 days
  };

  const growthData = getUserGrowthData();

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      metrics,
      popularSkills,
      growthData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swapr-report-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
              <p className="text-sm sm:text-base text-gray-600">Platform insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={exportReport}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalUsers}</p>
                <p className="text-sm text-green-600">+{metrics.newUsers} this period</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalSwaps}</p>
                <p className="text-sm text-green-600">+{metrics.newSwaps} this period</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowRightLeft className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.successRate}%</p>
                <p className="text-sm text-gray-600">{metrics.completedSwaps} completed</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.averageRating}</p>
                <p className="text-sm text-gray-600">{metrics.totalReviews} reviews</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {growthData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.date}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max((day.users / Math.max(...growthData.map(d => d.users))) * 100, 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{day.users}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Skills */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Popular Skills</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {popularSkills.map(([skill, count], index) => (
                <div key={skill} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">#{index + 1}</span>
                    <span className="text-sm text-gray-900">{skill}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(count / popularSkills[0][1]) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Swap Status Distribution</h4>
              <div className="space-y-2">
                {['pending', 'accepted', 'completed', 'rejected'].map(status => {
                  const count = swapRequests.filter(s => s.status === status).length;
                  const percentage = swapRequests.length > 0 ? Math.round((count / swapRequests.length) * 100) : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{status}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              status === 'completed' ? 'bg-green-600' :
                              status === 'accepted' ? 'bg-blue-600' :
                              status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">User Activity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium">{users.filter(u => !u.isAdmin && u.isPublic).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Inactive Users</span>
                  <span className="text-sm font-medium">{users.filter(u => !u.isAdmin && !u.isPublic).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Skills/User</span>
                  <span className="text-sm font-medium">
                    {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.skillsOffered.length + u.skillsWanted.length, 0) / users.length) : 0}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Review Metrics</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                  
                  return (
                    <div key={rating} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{rating} stars</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;