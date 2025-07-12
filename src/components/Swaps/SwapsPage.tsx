import React, { useState, useMemo } from 'react';
import { Clock, CheckCircle, XCircle, Trash2, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSwapRequests, useUsers, useNotifications, useReviews } from '../../hooks/useData';
import { SwapRequest } from '../../types';
import ReviewModal from './ReviewModal';

const SwapsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'completed'>('all');
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { swapRequests, updateSwapRequest, deleteSwapRequest } = useSwapRequests();
  const { users } = useUsers();
  const { createNotification } = useNotifications();
  const { createReview, reviews } = useReviews();

  const userRequests = useMemo(() => {
    if (!currentUser) return [];
    
    return swapRequests.filter(request => {
      if (activeTab === 'sent') {
        return request.fromUserId === currentUser.id;
      } else {
        return request.toUserId === currentUser.id;
      }
    }).filter(request => {
      if (statusFilter === 'all') return true;
      return request.status === statusFilter;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [swapRequests, currentUser, activeTab, statusFilter]);

  const handleAccept = (requestId: string) => {
    const request = swapRequests.find(r => r.id === requestId);
    if (!request) return;

    updateSwapRequest(requestId, { status: 'accepted' });
    
    createNotification({
      userId: request.fromUserId,
      type: 'swap_accepted',
      title: 'Request Accepted!',
      message: `${currentUser?.name} accepted your swap request`,
      isRead: false
    });
  };

  const handleReject = (requestId: string) => {
    const request = swapRequests.find(r => r.id === requestId);
    if (!request) return;

    updateSwapRequest(requestId, { status: 'rejected' });
    
    createNotification({
      userId: request.fromUserId,
      type: 'swap_rejected',
      title: 'Request Declined',
      message: `${currentUser?.name} declined your swap request`,
      isRead: false
    });
  };

  const handleComplete = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'completed' });
    setShowReviewModal(requestId);
  };

  const handleDelete = (requestId: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      deleteSwapRequest(requestId);
    }
  };

  const handleSubmitReview = (requestId: string, rating: number, comment: string) => {
    const request = swapRequests.find(r => r.id === requestId);
    if (!request || !currentUser) return;

    const revieweeId = activeTab === 'sent' ? request.toUserId : request.fromUserId;
    
    createReview({
      swapRequestId: requestId,
      reviewerId: currentUser.id,
      revieweeId,
      rating,
      comment
    });

    createNotification({
      userId: revieweeId,
      type: 'review',
      title: 'New Review',
      message: `${currentUser.name} left you a review`,
      isRead: false
    });

    setShowReviewModal(null);
  };

  const getUserById = (id: string) => users.find(u => u.id === id);
  
  const hasUserReviewed = (requestId: string) => {
    return reviews.some(r => r.swapRequestId === requestId && r.reviewerId === currentUser?.id);
  };

  const getStatusColor = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <Star className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your skill swap requests and collaborations</p>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-lg shadow-md mb-4 sm:mb-6 border border-white/20">
          <div className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6">
              <div className="flex space-x-4 sm:space-x-8 mb-4 sm:mb-0">
                <button
                  onClick={() => setActiveTab('received')}
                  className={`pb-2 sm:pb-4 border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === 'received'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Received Requests
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`pb-2 sm:pb-4 border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === 'sent'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sent Requests
                </button>
              </div>
              <div className="w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg sm:rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Request List */}
          <div className="divide-y divide-gray-200">
            {userRequests.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} requests
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {activeTab === 'sent' 
                    ? "You haven't sent any swap requests yet." 
                    : "You haven't received any swap requests yet."
                  }
                </p>
              </div>
            ) : (
              userRequests.map((request) => {
                const otherUser = getUserById(
                  activeTab === 'sent' ? request.toUserId : request.fromUserId
                );
                
                if (!otherUser) return null;

                return (
                  <div key={request.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                        <img
                          src={otherUser.profilePhoto || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100`}
                          alt={otherUser.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{otherUser.name}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium self-start ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </span>
                          </div>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Offering:</span> {request.skillOffered}
                            </p>
                            <p>
                              <span className="font-medium">Wants:</span> {request.skillWanted}
                            </p>
                            {request.message && (
                              <p className="break-words">
                                <span className="font-medium">Message:</span> {request.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 sm:flex-col sm:space-y-2 sm:space-x-0">
                        {activeTab === 'received' && request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(request.id)}
                              className="flex-1 sm:flex-none px-3 py-1 sm:px-3 sm:py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="flex-1 sm:flex-none px-3 py-1 sm:px-3 sm:py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {request.status === 'accepted' && (
                          <button
                            onClick={() => handleComplete(request.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                          >
                            Mark Complete
                          </button>
                        )}

                        {request.status === 'completed' && !hasUserReviewed(request.id) && (
                          <button
                            onClick={() => setShowReviewModal(request.id)}
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm flex items-center gap-1"
                          >
                            <Star className="h-3 w-3" />
                            Review
                          </button>
                        )}

                        {(request.status === 'pending' && activeTab === 'sent') || request.status === 'rejected' && (
                          <button
                            onClick={() => handleDelete(request.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete request"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <ReviewModal
            request={swapRequests.find(r => r.id === showReviewModal)!}
            otherUser={getUserById(
              activeTab === 'sent' 
                ? swapRequests.find(r => r.id === showReviewModal)!.toUserId
                : swapRequests.find(r => r.id === showReviewModal)!.fromUserId
            )!}
            onSubmit={handleSubmitReview}
            onClose={() => setShowReviewModal(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SwapsPage;