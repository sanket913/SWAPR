import React from 'react';
import { MapPin, Star, Clock, User as UserIcon, Award, Zap, Heart, Sparkles } from 'lucide-react';
import { User } from '../../types';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const joinedMonthsAgo = Math.floor(
    (new Date().getTime() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

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
    <div
      onClick={onClick}
      className="group interactive-card glass-card rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border-2 border-white/20 overflow-hidden relative animate-scale-in"
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      <div className="absolute inset-[2px] bg-white/95 backdrop-blur-lg rounded-3xl"></div>
      
      <div className="relative z-10 p-6">
        {/* Header with Profile */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative flex-shrink-0">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300 animate-pulse-glow"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                <UserIcon className="h-10 w-10 text-gray-400" />
              </div>
            )}
            
            {/* Online Status */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-gray-900 truncate group-hover:gradient-text transition-all duration-300 mb-1">
              {user.name}
            </h3>
            
            {user.location && (
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1 text-blue-500 flex-shrink-0" />
                <span className="truncate">{user.location}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-3 py-1 shadow-lg">
                <Star className="h-4 w-4 text-white mr-1" />
                <span className="text-sm font-black text-white">{user.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-600 font-semibold">({user.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <Award className="h-4 w-4 text-green-600 mr-2" />
            <h4 className="text-sm font-black text-gray-700">🎯 Skills Offered</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 bg-gradient-to-r ${getSkillColor(index)} text-white rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-in-left delay-${index * 100}`}
              >
                {skill}
              </span>
            ))}
            {user.skillsOffered.length > 2 && (
              <span className="px-3 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full text-xs font-bold shadow-lg">
                +{user.skillsOffered.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <Zap className="h-4 w-4 text-blue-600 mr-2" />
            <h4 className="text-sm font-black text-gray-700">💡 Looking to Learn</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 animate-slide-in-right delay-${index * 100}"
              >
                {skill}
              </span>
            ))}
            {user.skillsWanted.length > 2 && (
              <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border-2 border-gray-200">
                +{user.skillsWanted.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Availability & Join Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100 gap-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-purple-500 flex-shrink-0" />
            <span className="font-semibold truncate">{user.availability.slice(0, 2).join(', ') || 'Flexible schedule'}</span>
          </div>
          <span className="text-xs bg-gradient-to-r from-gray-100 to-blue-100 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
            {joinedMonthsAgo}mo member
          </span>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 px-6 py-4 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 border-t border-gray-100 group-hover:from-blue-50 group-hover:via-purple-50 group-hover:to-pink-50 transition-all duration-300">
        <button className="w-full text-blue-600 font-black text-sm hover:text-purple-600 transition-colors duration-300 flex items-center justify-center space-x-2 group-hover:scale-105 transform transition-transform">
          <Heart className="w-4 h-4 group-hover:text-pink-500 transition-colors duration-300" />
          <span>Connect & Start Learning</span>
          <Sparkles className="w-4 h-4 group-hover:text-yellow-500 transition-colors duration-300" />
        </button>
      </div>
    </div>
  );
};

export default UserCard;