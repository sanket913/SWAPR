import React, { useState } from 'react';
import { X, MapPin, Star, Calendar, MessageCircle, User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useSwapRequests, useNotifications } from '@/hooks/useData';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });
  const { currentUser } = useAuth();
  const { createSwapRequest } = useSwapRequests();
  const { createNotification } = useNotifications();

  const handleSendRequest = () => {
    if (!currentUser || !requestData.skillOffered || !requestData.skillWanted) return;

    const newRequest = createSwapRequest({
      fromUserId: currentUser.id,
      toUserId: user.id,
      skillOffered: requestData.skillOffered,
      skillWanted: requestData.skillWanted,
      message: requestData.message,
      status: 'pending'
    });

    // Create notification for the recipient
    createNotification({
      userId: user.id,
      type: 'swap_request',
      title: 'New Swap Request',
      message: `${currentUser.name} wants to swap ${requestData.skillOffered} for ${requestData.skillWanted}`,
      isRead: false
    });

    setShowRequestForm(false);
    setRequestData({ skillOffered: '', skillWanted: '', message: '' });
    onClose();
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Swap request sent successfully!');
  };

  const joinedDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 sm:border-4 border-white flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{user.name}</h1>
                {user.location && (
                  <div className="flex items-center mt-1 min-w-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">{user.location}</span>
                  </div>
                )}
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{user.rating.toFixed(1)} ({user.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Joined {joinedDate}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Skills Offered */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Skills Offered</h2>
            <div className="flex flex-wrap gap-2 sm:gap-2">
              {user.skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Looking to Learn</h2>
            <div className="flex flex-wrap gap-2 sm:gap-2">
              {user.skillsWanted.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Availability</h2>
            <div className="flex flex-wrap gap-2 sm:gap-2">
              {user.availability.length > 0 ? (
                user.availability.map((time, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {time}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 text-xs sm:text-sm">Not specified</span>
              )}
            </div>
          </div>

          {/* Action Button */}
          {currentUser && currentUser.id !== user.id && !showRequestForm && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <button
                onClick={() => setShowRequestForm(true)}
                className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Send Swap Request
              </button>
            </div>
          )}

          {/* Request Form */}
          {showRequestForm && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Send Swap Request</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    I can offer:
                  </label>
                  <select
                    value={requestData.skillOffered}
                    onChange={(e) => setRequestData(prev => ({ ...prev, skillOffered: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select a skill you can offer</option>
                    {currentUser?.skillsOffered.map((skill, index) => (
                      <option key={index} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    I want to learn:
                  </label>
                  <select
                    value={requestData.skillWanted}
                    onChange={(e) => setRequestData(prev => ({ ...prev, skillWanted: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select a skill you want to learn</option>
                    {user.skillsOffered.map((skill, index) => (
                      <option key={index} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Message (optional):
                  </label>
                  <textarea
                    value={requestData.message}
                    onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                    rows={2}
                    placeholder="Introduce yourself and explain why you'd like to swap skills..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendRequest}
                    disabled={!requestData.skillOffered || !requestData.skillWanted}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;