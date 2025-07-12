import React, { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2, User, MapPin, Calendar, Star, Award, Zap, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    location: currentUser?.location || '',
    profilePhoto: currentUser?.profilePhoto || '',
    skillsOffered: [...(currentUser?.skillsOffered || [])],
    skillsWanted: [...(currentUser?.skillsWanted || [])],
    availability: [...(currentUser?.availability || [])],
    isPublic: currentUser?.isPublic ?? true
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  if (!currentUser) return null;

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name,
      location: currentUser.location || '',
      profilePhoto: currentUser.profilePhoto || '',
      skillsOffered: [...currentUser.skillsOffered],
      skillsWanted: [...currentUser.skillsWanted],
      availability: [...currentUser.availability],
      isPublic: currentUser.isPublic
    });
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const addAvailability = () => {
    if (newAvailability.trim() && !formData.availability.includes(newAvailability.trim())) {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, newAvailability.trim()]
      }));
      setNewAvailability('');
    }
  };

  const removeSkillOffered = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((_, i) => i !== index)
    }));
  };

  const removeSkillWanted = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((_, i) => i !== index)
    }));
  };

  const removeAvailability = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const joinedDate = new Date(currentUser.joinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getSkillColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-rose-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header with Gradient Background */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-8 sm:py-12 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 w-full lg:w-auto">
                <div className="relative group">
                  {currentUser.profilePhoto ? (
                    <img
                      src={currentUser.profilePhoto}
                      alt={currentUser.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl object-cover border-3 sm:border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center border-3 sm:border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-3 sm:border-4 border-white flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="text-white">
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-shadow-lg">{currentUser.name}</h1>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {currentUser.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-white/80 flex-shrink-0" />
                        <span className="text-sm sm:text-lg text-white/90">{currentUser.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-white/80 flex-shrink-0" />
                      <span className="text-sm sm:text-lg text-white/90">Joined {joinedDate}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0" />
                      <span className="text-sm sm:text-lg font-semibold">{currentUser.rating.toFixed(1)}</span>
                      <span className="text-white/80 ml-2 text-sm sm:text-base">({currentUser.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="group bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 sm:gap-3 font-semibold border border-white/30 transform hover:scale-105 mt-4 lg:mt-0 text-sm sm:text-base"
              >
                <Edit2 className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8 space-y-6 sm:space-y-10">
            {isEditing && (
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pb-4 sm:pb-6 border-b border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-medium transform hover:scale-105 text-sm sm:text-base"
                >
                  <X className="h-4 w-4 sm:h-4 sm:w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <Save className="h-4 w-4 sm:h-4 sm:w-4" />
                  Save Changes
                </button>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-blue-100">
              <div className="flex items-center mb-4 sm:mb-6">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 text-base sm:text-lg font-medium bg-white/60 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 break-words">{currentUser.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, State or Country"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 text-base sm:text-lg font-medium bg-white/60 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 break-words">{currentUser.location || 'Not specified'}</p>
                  )}
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Profile Photo URL</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.profilePhoto}
                      onChange={(e) => setFormData(prev => ({ ...prev, profilePhoto: e.target.value }))}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-gray-900 text-base sm:text-lg font-medium bg-white/60 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 break-all">{currentUser.profilePhoto || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-green-100">
              <div className="flex items-center mb-4 sm:mb-6">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Privacy Settings</h2>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  disabled={!isEditing}
                  className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 transform scale-110 sm:scale-125 mt-1"
                />
                <div>
                  <span className="text-gray-900 font-semibold text-base sm:text-lg">Make my profile public</span>
                  <p className="text-gray-600 text-sm sm:text-base">Allow other users to discover and connect with you</p>
                </div>
              </div>
            </div>

            {/* Skills Offered */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-green-100">
              <div className="flex items-center mb-4 sm:mb-6">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Skills I Can Offer</h2>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {formData.skillsOffered.map((skill, index) => (
                    <span
                      key={index}
                      className={`group inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r ${getSkillColor(index)} text-white rounded-full text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillOffered(index)}
                          className="ml-1 sm:ml-2 text-white/80 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                        >
                          <X className="h-3 w-3 sm:h-3 sm:w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="text"
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                      placeholder="Add a skill you can offer"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    />
                    <button
                      onClick={addSkillOffered}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl sm:rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Wanted */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-blue-100">
              <div className="flex items-center mb-4 sm:mb-6">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Skills I Want to Learn</h2>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {formData.skillsWanted.map((skill, index) => (
                    <span
                      key={index}
                      className="group inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillWanted(index)}
                          className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:scale-110 transform"
                        >
                          <X className="h-3 w-3 sm:h-3 sm:w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="text"
                      value={newSkillWanted}
                      onChange={(e) => setNewSkillWanted(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                      placeholder="Add a skill you want to learn"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    />
                    <button
                      onClick={addSkillWanted}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-purple-100">
              <div className="flex items-center mb-4 sm:mb-6">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Availability</h2>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {formData.availability.map((time, index) => (
                    <span
                      key={index}
                      className="group inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:scale-105"
                    >
                      {time}
                      {isEditing && (
                        <button
                          onClick={() => removeAvailability(index)}
                          className="ml-1 sm:ml-2 text-purple-600 hover:text-purple-800 transition-colors duration-300 hover:scale-110 transform"
                        >
                          <X className="h-3 w-3 sm:h-3 sm:w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="text"
                      value={newAvailability}
                      onChange={(e) => setNewAvailability(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
                      placeholder="e.g., Weekends, Evenings, Mornings"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    />
                    <button
                      onClick={addAvailability}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;