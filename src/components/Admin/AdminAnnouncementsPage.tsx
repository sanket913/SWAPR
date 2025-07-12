import React, { useState } from 'react';
import { Megaphone, Send, Users, Calendar, Edit, Trash2, Plus } from 'lucide-react';
import { useNotifications, useUsers } from '@/hooks/useData';

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  sentTo: 'all' | 'active' | 'inactive';
  sentCount: number;
}

const AdminAnnouncementsPage: React.FC = () => {
  const { createNotification } = useNotifications();
  const { users } = useUsers();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const stored = localStorage.getItem('announcements');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    sendTo: 'all' as 'all' | 'active' | 'inactive'
  });

  const saveAnnouncements = (newAnnouncements: Announcement[]) => {
    setAnnouncements(newAnnouncements);
    localStorage.setItem('announcements', JSON.stringify(newAnnouncements));
  };

  const handleSendAnnouncement = () => {
    if (!formData.title.trim() || !formData.message.trim()) return;

    let targetUsers = users.filter(u => !u.isAdmin);
    
    switch (formData.sendTo) {
      case 'active':
        targetUsers = targetUsers.filter(u => u.isPublic);
        break;
      case 'inactive':
        targetUsers = targetUsers.filter(u => !u.isPublic);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Send notifications to all target users
    targetUsers.forEach(user => {
      createNotification({
        userId: user.id,
        type: 'admin_announcement',
        title: formData.title,
        message: formData.message,
        isRead: false
      });
    });

    // Save announcement record
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      createdAt: new Date().toISOString(),
      sentTo: formData.sendTo,
      sentCount: targetUsers.length
    };

    saveAnnouncements([newAnnouncement, ...announcements]);

    // Reset form
    setFormData({ title: '', message: '', sendTo: 'all' });
    setShowCreateForm(false);

    alert(`Announcement sent to ${targetUsers.length} users!`);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      saveAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const getUserCounts = () => {
    const nonAdminUsers = users.filter(u => !u.isAdmin);
    return {
      all: nonAdminUsers.length,
      active: nonAdminUsers.filter(u => u.isPublic).length,
      inactive: nonAdminUsers.filter(u => !u.isPublic).length
    };
  };

  const userCounts = getUserCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
              <p className="text-sm sm:text-base text-gray-600">Send platform-wide announcements to users</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
            >
              <Plus className="h-4 w-4" />
              <span>New Announcement</span>
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">All Users</p>
                <p className="text-2xl font-bold text-gray-900">{userCounts.all}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{userCounts.active}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">{userCounts.inactive}</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Create Announcement Form */}
        {showCreateForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Announcement</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Announcement title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Write your announcement message..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To
                </label>
                <select
                  value={formData.sendTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, sendTo: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users ({userCounts.all})</option>
                  <option value="active">Active Users ({userCounts.active})</option>
                  <option value="inactive">Inactive Users ({userCounts.inactive})</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendAnnouncement}
                  disabled={!formData.title.trim() || !formData.message.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Announcement</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Announcement History</h2>
          </div>

          {announcements.length === 0 ? (
            <div className="p-12 text-center">
              <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
              <p className="text-gray-600">Create your first announcement to communicate with users.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.sentTo === 'all' ? 'bg-blue-100 text-blue-800' :
                          announcement.sentTo === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {announcement.sentTo === 'all' ? 'All Users' :
                           announcement.sentTo === 'active' ? 'Active Users' : 'Inactive Users'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{announcement.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>Sent to {announcement.sentCount} users</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

export default AdminAnnouncementsPage;