import React from 'react';
import { Users, ArrowRight, Star, Shield, Zap, Play, CheckCircle, TrendingUp, Sparkles, Rocket, Heart, Globe } from 'lucide-react';
import Image from 'next/image';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Users,
      title: 'Connect & Learn',
      description: 'Find people with complementary skills and learn from each other in our vibrant community',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      delay: 'delay-100'
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Build trust through our comprehensive rating system and honest feedback',
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      delay: 'delay-200'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Verified profiles and secure platform for complete peace of mind',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      delay: 'delay-300'
    },
    {
      icon: Zap,
      title: 'Quick Matches',
      description: 'AI-powered matching algorithm to find your perfect skill exchange partner',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      delay: 'delay-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Graphic Designer → React Developer',
      content: 'I learned React.js by teaching design principles. This platform completely transformed my career trajectory and opened new opportunities!',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      skills: ['Design', 'React.js'],
      gradient: 'from-pink-400 to-purple-600'
    },
    {
      name: 'Mike Chen',
      role: 'Full Stack Developer → Photographer',
      content: 'Improved my photography skills while sharing my coding knowledge. The community here is absolutely amazing and supportive!',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      skills: ['Photography', 'Coding'],
      gradient: 'from-blue-400 to-cyan-600'
    },
    {
      name: 'Emma Davis',
      role: 'Photographer → Marketing Expert',
      content: 'Found incredible people to exchange skills with. The quality of connections and learning experiences is truly outstanding!',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      skills: ['Photography', 'Marketing'],
      gradient: 'from-green-400 to-blue-600'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { number: '25K+', label: 'Skills Exchanged', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { number: '98%', label: 'Success Rate', icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
    { number: '4.9', label: 'Average Rating', icon: Star, color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 particle-bg overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rounded-full blur-2xl animate-float delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-lg animate-float delay-700"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-6 py-3 glass-card rounded-full mb-8 animate-bounce-in">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-semibold gradient-text">Join 10,000+ skill swappers worldwide</span>
              <Sparkles className="w-4 h-4 ml-2 text-yellow-500 animate-pulse" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8 animate-slide-in-up leading-tight">
              <span className="block gradient-text-rainbow">Swap Skills,</span>
              <span className="block text-gray-800 animate-slide-in-up delay-200">Share Knowledge</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-slide-in-up delay-300">Transform Lives</span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed animate-slide-in-up delay-500 px-4">
              Connect with passionate learners worldwide to exchange skills, unlock new abilities, and grow together. 
              <span className="gradient-text font-semibold"> Welcome to Swapr—where skills meet opportunity!</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-in-up delay-700 px-4">
              <button
                onClick={onGetStarted}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 font-bold text-lg overflow-hidden animate-pulse-glow"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Start Your Journey Free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              
              <button className="group glass-card text-gray-700 px-10 py-5 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:scale-105 font-bold text-lg border-2 border-transparent hover:border-purple-300">
                <span className="flex items-center justify-center gap-3">
                  <Play className="w-6 h-6 group-hover:scale-125 transition-transform duration-300 text-purple-600" />
                  Watch Demo
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-slide-in-up delay-1000 px-4">
              {stats.map((stat, index) => (
                <div key={index} className="group text-center hover-lift">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 gradient-text">{stat.number}</div>
                  <div className="text-lg text-gray-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 glass-card relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 animate-slide-in-up">
              Why Choose 
              <span className="gradient-text-rainbow"> Swapr?</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto animate-slide-in-up delay-200 px-4">
              Experience the future of learning through our revolutionary skill exchange platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group interactive-card glass-card rounded-3xl p-8 hover-lift ${feature.delay} animate-slide-in-up`}
              >
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
                  
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 animate-slide-in-up">How It Works</h2>
            <p className="text-2xl text-gray-600 animate-slide-in-up delay-200">Get started in three magical steps</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-1/3 w-1/3 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 transform -translate-y-1/2 rounded-full animate-shimmer"></div>
            <div className="hidden lg:block absolute top-1/2 right-1/3 w-1/3 h-1 bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 transform -translate-y-1/2 rounded-full animate-shimmer delay-500"></div>

            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'List the skills you can teach and what you want to learn with our intuitive profile builder',
                image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'Find Skill Partners',
                description: 'Browse and connect with amazing people who have complementary skills using our smart matching',
                image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                title: 'Start Swapping',
                description: 'Exchange knowledge, learn new skills, and grow together in our supportive community',
                image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
                gradient: 'from-green-500 to-emerald-500'
              }
            ].map((step, index) => (
              <div key={index} className={`text-center group animate-slide-in-up delay-${index * 200 + 300}`}>
                <div className="relative mb-8">
                  <div className="relative w-40 h-40 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover rounded-3xl shadow-2xl animate-morph"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-30 rounded-3xl group-hover:opacity-50 transition-opacity duration-300`}></div>
                  </div>
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${step.gradient} text-white rounded-2xl text-3xl font-black mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 relative -mt-10 z-10 animate-pulse-glow`}>
                    {step.step}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:gradient-text transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed px-4">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 glass-card relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 animate-slide-in-up">
              What Our 
              <span className="gradient-text-rainbow">Community</span> Says
            </h2>
            <p className="text-2xl text-gray-600 animate-slide-in-up delay-200">Join thousands of happy skill swappers transforming their lives</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group interactive-card glass-card rounded-3xl p-8 hover-lift animate-slide-in-up delay-${index * 200 + 300} relative overflow-hidden`}
              >
                {/* Quote Background */}
                <div className="absolute top-4 right-4 text-8xl text-blue-100 font-serif opacity-50">"</div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-2xl object-cover shadow-xl group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-black text-gray-900 text-xl">{testimonial.name}</h4>
                      <p className="text-gray-600 font-semibold">{testimonial.role}</p>
                      <div className="flex items-center mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 italic leading-relaxed mb-6 text-lg">"{testimonial.content}"</p>
                  
                  <div className="flex flex-wrap gap-3">
                    {testimonial.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className={`px-4 py-2 bg-gradient-to-r ${testimonial.gradient} text-white rounded-full text-sm font-bold shadow-lg`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Gradient Border */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 animate-gradient-shift opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-float delay-500"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-bounce-in">
            <Globe className="w-20 h-20 text-yellow-300 mx-auto mb-8 animate-float" />
          </div>
          
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-8 animate-slide-in-up leading-tight">
            Ready to Start Your
            <span className="block text-yellow-300 animate-slide-in-up delay-200">Epic Skill Journey?</span>
          </h2>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-blue-100 mb-12 leading-relaxed animate-slide-in-up delay-300">
            Join our amazing community today and discover the incredible power of skill exchange
          </p>
          
          <button
            onClick={onGetStarted}
            className="group relative bg-white text-purple-600 px-12 py-6 rounded-2xl hover:shadow-2xl transition-all duration-500 font-black text-xl transform hover:scale-110 animate-slide-in-up delay-500 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              <Sparkles className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
              Start Swapping Skills Now
              <Rocket className="w-8 h-8 group-hover:translate-y-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;