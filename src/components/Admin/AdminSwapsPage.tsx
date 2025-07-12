import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Star, AlertTriangle } from 'lucide-react';
import { useSwapRequests, useUsers } from '@/hooks/useData';
import { SwapRequest } from '@/types';

const AdminSwapsPage: React.FC = () => {
  const { swapRequests, updateSwapRequest } = useSwapRequests();
  const { users } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'completed'>('all');
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const filteredSwaps = swapRequests.filter(swap => {
    const fromUser = users.find(u => u.id === swap.fromUserId);
    const toUser = users.find(u => u.id === swap.toUserId);
    
    const matchesSearch = 
      fromUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      toUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.skillOffered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.skillWanted.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || swap.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const getStatusBadge = (status: SwapRequest['status']) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { color: 'bg-blue-100 text-blue-800', icon: Star },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSwapAction = (swapId: string, action: 'view' | 'approve' | 'reject' | 'flag') => {
    const swap = swapRequests.find(s => s.id === swapId);
    if (!swap) return;

    switch (action) {
      case 'view':
        setSelectedSwap(swap);
        setShowSwapModal(true);
        break;
      case 'approve':
        updateSwapRequest(swapId, { status: 'accepted' });
        break;
      case 'reject':
        updateSwapRequest(swapId, { status: 'rejected' });
        break;
      case 'flag':
        console.log('Flagging swap for review:', swapId);
        break;
    }
  };

  const getUserById = (id: string) => users.find(u => u.id === id);

  const stats = {
    total: swapRequests.length,
    pending: swapRequests.filter(s => s.status === 'pending').length,
    completed: swapRequests.filter(s => s.status === 'completed').length,
    successRate: swapRequests.length > 0 
      ? Math.round((swapRequests.filter(s => s.status === 'completed').length / swapRequests.length) * 100)
      : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Swap Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Monitor and manage skill exchange requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Swaps</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-blue-600">{stats.successRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4 sm:p-6 mb-6 border border-white/20">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search swaps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Swaps Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills Exchange
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSwaps.map((swap) => {
                  const fromUser = getUserById(swap.fromUserId);
                  const toUser = getUserById(swap.toUserId);
                  
                  return (
                    <tr key={swap.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex -space-x-2">
                            <img
                              className="h-8 w-8 rounded-full border-2 border-white object-cover"
                              src={fromUser?.profilePhoto || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100`}
                              alt={fromUser?.name}
                            />
                            <img
                              className="h-8 w-8 rounded-full border-2 border-white object-cover"
                              src={toUser?.profilePhoto || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100`}
                              alt={toUser?.name}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {fromUser?.name} → {toUser?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {fromUser?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{swap.skillOffered}</div>
                          <div className="text-gray-500">↓</div>
                          <div className="font-medium">{swap.skillWanted}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(swap.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(swap.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleSwapAction(swap.id, 'view')}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {swap.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleSwapAction(swap.id, 'approve')}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleSwapAction(swap.id, 'reject')}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleSwapAction(swap.id, 'flag')}
                            className="text-orange-600 hover:text-orange-900 p-1"
                            title="Flag for Review"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredSwaps.length === 0 && (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>

        {/* Swap Details Modal */}
        {showSwapModal && selectedSwap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Swap Details</h2>
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <img
                        className="h-16 w-16 rounded-full object-cover mx-auto mb-2"
                        src={getUserById(selectedSwap.fromUserId)?.profilePhoto || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100`}
                        alt="From User"
                      />
                      <div className="text-sm font-medium">{getUserById(selectedSwap.fromUserId)?.name}</div>
                    </div>
                    <div className="text-2xl text-gray-400">↔</div>
                    <div className="text-center">
                      <img
                        className="h-16 w-16 rounded-full object-cover mx-auto mb-2"
                        src={getUserById(selectedSwap.toUserId)?.profilePhoto || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100`}
                        alt="To User"
                      />
                      <div className="text-sm font-medium">{getUserById(selectedSwap.toUserId)?.name}</div>
                    </div>
                  </div>
                  {getStatusBadge(selectedSwap.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Skill Offered</h4>
                    <p className="text-green-700">{selectedSwap.skillOffered}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Skill Wanted</h4>
                    <p className="text-blue-700">{selectedSwap.skillWanted}</p>
                  </div>
                </div>

                {selectedSwap.message && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedSwap.message}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(selectedSwap.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(selectedSwap.updatedAt).toLocaleString()}
                  </div>
                </div>

                {selectedSwap.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleSwapAction(selectedSwap.id, 'approve');
                        setShowSwapModal(false);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve Swap
                    </button>
                    <button
                      onClick={() => {
                        handleSwapAction(selectedSwap.id, 'reject');
                        setShowSwapModal(false);
                      }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject Swap
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSwapsPage;