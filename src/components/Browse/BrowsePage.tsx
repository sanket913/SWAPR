import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Clock, Filter, Users, Sparkles, TrendingUp, Zap, Globe, Target } from 'lucide-react';
import { useUsers } from '@/hooks/useData';
import { useAuth } from '@/context/AuthContext';
import UserCard from './UserCard';

interface BrowsePageProps {
  onUserSelect: (userId: string) => void;
}

const BrowsePage: React.FC<BrowsePageProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<'all' | 'offered' | 'wanted'>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'newest'>('relevance');
  const { users, searchUsers } = useUsers();
  const { currentUser } = useAuth();

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => 
      user.id !== currentUser?.id && 
      user.isPublic && 
      !user.isAdmin
    );

    if (searchQuery.trim()) {
      const searchResults = searchUsers(
        searchQuery, 
        skillFilter === 'all' ? undefined : skillFilter
      );
      filtered = filtered.filter(user => 
        searchResults.some(result => result.id === user.id)
      );
    }

    if (locationFilter.trim()) {
      filtered = filtered.filter(user =>
        user.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
        break;
      default:
        if (searchQuery.trim()) {
          filtered.sort((a, b) => {
            const aMatches = [...a.skillsOffered, ...a.skillsWanted]
              .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())).length;
            const bMatches = [...b.skillsOffered, ...b.skillsWanted]
              .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())).length;
            return bMatches - aMatches;
          });
        }
        break;
    }

    return filtered;
  }, [users, currentUser, searchQuery, skillFilter, locationFilter, sortBy, searchUsers]);

  const popularSkills = [
    { name: 'React.js', count: 45, gradient: 'from-blue-500 to-cyan-500', icon: '⚛️' },
    { name: 'Graphic Design', count: 38, gradient: 'from-purple-500 to-pink-500', icon: '🎨' },
    { name: 'Photography', count: 32, gradient: 'from-green-500 to-emerald-500', icon: '📸' },
    { name: 'Spanish', count: 28, gradient: 'from-yellow-500 to-orange-500', icon: '🇪🇸' },
    { name: 'Python', count: 25, gradient: 'from-red-500 to-rose-500', icon: '🐍' },
    { name: 'UI/UX Design', count: 22, gradient: 'from-indigo-500 to-purple-500', icon: '✨' },
    { name: 'Guitar', count: 20, gradient: 'from-pink-500 to-rose-500', icon: '🎸' },
    { name: 'Marketing', count: 18, gradient: 'from-teal-500 to-cyan-500', icon: '📈' }
  ];

  const stats = [
    { label: 'Active Users', value: filteredUsers.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Skills Available', value: '150+', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { label: 'Success Rate', value: '98%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' }
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
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mb-6 animate-pulse-glow">
            <Globe className="h-10 w-10 text-white animate-float" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black mb-4 px-4">
            Discover Amazing
            <span className="gradient-text-rainbow block"> Skill Masters</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 px-4 max-w-4xl mx-auto">
            Connect with talented people and find your perfect skill exchange partner in our vibrant community
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 px-4">
            {stats.map((stat, index) => (
              <div key={index} className={`group glass-card rounded-2xl px-6 py-4 shadow-xl hover-lift animate-slide-in-up delay-${index * 100 + 200}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black gradient-text">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-3xl shadow-2xl p-6 mb-8 border-2 border-white/20 animate-slide-in-up delay-300 hover-lift">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search amazing skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 glass-card hover:border-blue-300 font-medium"
              />
            </div>

            {/* Skill Type Filter */}
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 glass-card hover:border-blue-300 font-medium"
            >
              <option value="all">🌟 All Skills</option>
              <option value="offered">🎯 Skills Offered</option>
              <option value="wanted">💡 Skills Wanted</option>
            </select>

            {/* Location Filter */}
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 glass-card hover:border-blue-300 font-medium"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 glass-card hover:border-blue-300 font-medium"
            >
              <option value="relevance">🎯 Most Relevant</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="newest">🆕 Newest Members</option>
            </select>
          </div>

          {/* Popular Skills */}
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
              <p className="text-sm font-black text-gray-700">🔥 Trending Skills:</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {popularSkills.slice(0, window.innerWidth < 640 ? 6 : 8).map((skill, index) => (
                <button
                  key={skill.name}
                  onClick={() => setSearchQuery(skill.name)}
                  className={`group relative px-4 py-2 bg-gradient-to-r ${skill.gradient} text-white rounded-full text-sm font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-110 overflow-hidden animate-slide-in-up delay-${index * 50 + 400}`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{skill.icon}</span>
                    <span>{skill.name}</span>
                    <span className="text-xs opacity-80 hidden sm:inline">({skill.count})</span>
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-4 animate-bounce-in">
            <div className="relative inline-block mb-6">
              <Target className="h-24 w-24 text-gray-300 mx-auto animate-float" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 gradient-text">No amazing people found</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or explore our trending skills above to discover incredible talent!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setLocationFilter('');
                setSkillFilter('all');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-lg animate-pulse-glow"
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Clear Filters & Explore
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-4 animate-slide-in-up delay-500">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                <span className="gradient-text">Found {filteredUsers.length} amazing</span>
                <span className="text-gray-800"> {filteredUsers.length === 1 ? 'person' : 'people'}</span>
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 glass-card px-4 py-2 rounded-full">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="font-semibold">Live results</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`animate-slide-in-up delay-${index * 100 + 600}`}
                >
                  <UserCard
                    user={user}
                    onClick={() => onUserSelect(user.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;