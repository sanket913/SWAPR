import React from 'react';
import { Bell, CheckCircle, XCircle, Star, MessageSquare, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useData';

const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, markAsRead } = useNotifications();

  const userNotifications = notifications
    .filter(n => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'swap_request': return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'swap_accepted': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'swap_rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'review': return <Star className="h-5 w-5 text-yellow-600" />;
      case 'admin_announcement': return <Megaphone className="h-5 w-5 text-purple-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white';
    
    switch (type) {
      case 'swap_request': return 'bg-blue-50';
      case 'swap_accepted': return 'bg-green-50';
      case 'swap_rejected': return 'bg-red-50';
      case 'review': return 'bg-yellow-50';
      case 'admin_announcement': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-sm sm:text-base text-gray-600">Stay updated with your skill swap activities</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-lg shadow-md border border-white/20">
          {userNotifications.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-sm sm:text-base text-gray-600">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                    getNotificationBgColor(notification.type, notification.isRead)
                  }`}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm sm:text-base font-medium ${
                            notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-xs sm:text-sm break-words ${
                            notification.isRead ? 'text-gray-600' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="flex-shrink-0 ml-4">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;