'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, MapPin, Clock, Users, Sparkles,
  TrendingUp, Zap, Globe, Target
} from 'lucide-react';
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
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { users, searchUsers } = useUsers();
  const { currentUser } = useAuth();

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        const results = await searchUsers(
          searchQuery,
          skillFilter === 'all' ? undefined : skillFilter
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery, skillFilter, searchUsers]);

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.id !== currentUser?.id &&
      user.isPublic &&
      !user.isAdmin
    );

    if (searchQuery.trim()) {
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
        filtered.sort(
          (a, b) =>
            new Date(b.joinedDate).getTime() -
            new Date(a.joinedDate).getTime()
        );
        break;
      default:
        if (searchQuery.trim()) {
          filtered.sort((a, b) => {
            const aMatches = [...a.skillsOffered, ...a.skillsWanted].filter(skill =>
              skill.toLowerCase().includes(searchQuery.toLowerCase())
            ).length;
            const bMatches = [...b.skillsOffered, ...b.skillsWanted].filter(skill =>
              skill.toLowerCase().includes(searchQuery.toLowerCase())
            ).length;
            return bMatches - aMatches;
          });
        }
        break;
    }

    return filtered;
  }, [users, currentUser, searchQuery, searchResults, locationFilter, sortBy]);

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-yellow-400/10 rounded-full blur-xl animate-float delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mb-6 animate-pulse-glow">
            <Globe className="h-10 w-10 text-white animate-float" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black mb-4 px-4">
            Discover Amazing
            <span className="gradient-text-rainbow block"> Skill Masters</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Connect with talented people and find your perfect skill exchange partner in our vibrant community
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 px-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group glass-card rounded-2xl px-6 py-4 shadow-xl hover-lift animate-slide-in-up delay-${index * 100 + 200}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
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

        {/* Filters */}
        <div className="glass-card rounded-3xl shadow-2xl p-6 mb-8 border-2 border-white/20 animate-slide-in-up delay-300 hover-lift">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search amazing skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 glass-card"
              />
            </div>

            {/* Filters */}
            <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value as any)} className="glass-card px-4 py-3 border-2 rounded-2xl">
              <option value="all">🌟 All Skills</option>
              <option value="offered">🎯 Skills Offered</option>
              <option value="wanted">💡 Skills Wanted</option>
            </select>

            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl glass-card"
              />
            </div>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="glass-card px-4 py-3 border-2 rounded-2xl">
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
              {popularSkills.slice(0, windowWidth < 640 ? 6 : 8).map((skill, index) => (
                <button
                  key={skill.name}
                  onClick={() => setSearchQuery(skill.name)}
                  className={`group px-4 py-2 bg-gradient-to-r ${skill.gradient} text-white rounded-full text-sm font-bold hover:scale-110 transition-all`}
                >
                  <span className="flex items-center gap-2">
                    <span>{skill.icon}</span>
                    <span>{skill.name}</span>
                    <span className="text-xs hidden sm:inline">({skill.count})</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Target className="h-24 w-24 text-gray-300 mx-auto animate-float mb-6" />
            <h3 className="text-3xl font-black mb-4">No amazing people found</h3>
            <p className="text-gray-600 mb-6">Try changing filters or explore trending skills above.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setLocationFilter('');
                setSkillFilter('all');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-bold"
            >
              <Zap className="w-4 h-4 inline mr-2" /> Clear Filters & Explore
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black">
                <span className="gradient-text">{filteredUsers.length}</span> {filteredUsers.length === 1 ? 'person' : 'people'} found
              </h2>
              <div className="text-sm text-gray-600 flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <Clock className="h-4 w-4 text-green-500" /> <span>Live results</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <div key={user.id} className={`animate-slide-in-up delay-${index * 100 + 500}`}>
                  <UserCard user={user} onClick={() => onUserSelect(user.id)} />
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
