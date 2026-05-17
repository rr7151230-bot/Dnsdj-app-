import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Terminal, Radio, Code, Globe, PlayCircle, Download, CreditCard, Clock, Instagram, Star, TrendingUp } from 'lucide-react';
import { CyberCard, CyberButton } from '../components/CyberComponents';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const services = [
    { title: '100 FOLLOWERS', price: 10, discount: 'Hot', icon: Instagram },
    { title: '500 FOLLOWERS', price: 50, discount: '10% OFF', icon: Star },
    { title: '1000 FOLLOWERS', price: 90, discount: 'Most Popular', icon: TrendingUp },
  ];

  const categories = [
    { name: 'Ethical Hacking', icon: Lock, color: 'text-red-500', path: '/videos?cat=hacking' },
    { name: 'Cyber Security', icon: Shield, color: 'text-cyber-blue', path: '/videos?cat=security' },
    { name: 'Tools Learning', icon: Terminal, color: 'text-purple-500', path: '/videos?cat=tools' },
    { name: 'Networking', icon: Globe, color: 'text-green-500', path: '/videos?cat=networking' },
    { name: 'Programming', icon: Code, color: 'text-yellow-500', path: '/videos?cat=code' },
    { name: 'Cyber News', icon: Radio, color: 'text-blue-500', path: '/videos?cat=news' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyber-blue blur-2xl opacity-20 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-cyber font-bold tracking-tighter relative">
              DNSDJ <span className="text-cyber-blue cyber-glitch-text">CYBER GYAAN</span>
            </h1>
          </div>
        </motion.div>
        
        <p className="max-w-2xl mx-auto text-gray-400 text-lg">
          Master the art of Ethical Hacking and Cyber Security with premium industrial grade knowledge.
          Secure your future in the digital world.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/videos">
            <CyberButton className="h-12 px-10">START LEARNING</CyberButton>
          </Link>
          <Link to="/resources">
            <CyberButton variant="outline" className="h-12 px-10">PREMIUM FILES</CyberButton>
          </Link>
        </div>
      </section>

      {/* Dashboard Greeting */}
      {profile && (
        <CyberCard glow className="bg-cyber-blue/5 border-cyber-blue/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-cyber-blue/20 flex items-center justify-center border border-cyber-blue">
                <UserAvatar name={profile.displayName} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-cyber">WELCOME BACK, {profile.displayName?.toUpperCase()}</h2>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase",
                    profile.membership === 'premium' ? "bg-yellow-500 text-black" : "bg-gray-700 text-gray-300"
                  )}>
                    {profile.membership} AGENT
                  </span>
                  <span className="text-xs text-gray-400">ID: {profile.userId.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {profile.role === 'admin' && (
                <Link to="/admin">
                  <CyberButton className="bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30 text-xs py-2 h-auto">
                    ADMIN PANEL
                  </CyberButton>
                </Link>
              )}
              <div className="flex gap-4">
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10 w-24">
                  <p className="text-xs text-gray-500 uppercase">ACCESS</p>
                  <p className="text-xl font-cyber text-green-500">FULL</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10 w-24">
                  <p className="text-xs text-gray-500 uppercase">STATUS</p>
                  <p className="text-xl font-cyber text-cyber-blue">ACTIVE</p>
                </div>
              </div>
            </div>
          </div>
        </CyberCard>
      )}

      {/* Instagram Services Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-cyber tracking-tight flex items-center gap-2">
            <Instagram className="w-6 h-6 text-pink-500" />
            SOCIAL BOOST HUB
          </h2>
          <div className="h-px flex-1 mx-6 bg-gradient-to-r from-pink-500/30 to-transparent" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <CyberCard key={idx} glow className="relative overflow-hidden group border-pink-500/20">
              <div className="absolute top-0 right-0 bg-pink-500 text-black text-[10px] font-bold px-3 py-1 font-cyber italic transform rotate-12 translate-x-2 -translate-y-1">
                {service.discount}
              </div>
              <div className="space-y-4">
                <service.icon className="w-10 h-10 text-pink-500 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-cyber font-bold">{service.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-cyber text-white">₹{service.price}</span>
                  <span className="text-xs text-gray-500 font-mono">/ ONLY</span>
                </div>
                <CyberButton 
                  onClick={() => navigate(`/payment?item=Instagram+Followers&price=${service.price}`)}
                  className="w-full bg-pink-500/20 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition-all"
                >
                  BUY NOW
                </CyberButton>
              </div>
            </CyberCard>
          ))}
        </div>
      </section>

      {/* Featured Video Ad */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-cyber tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-500 animate-pulse" />
            FEATURED MASTERCLASS
          </h2>
          <div className="h-px flex-1 mx-6 bg-gradient-to-r from-red-500/30 to-transparent" />
        </div>

        <CyberCard glow className="p-0 overflow-hidden border-red-500/30">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-3 aspect-video">
              <iframe 
                src="https://www.youtube.com/embed/ZzOnzgzLasI" 
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
            <div className="md:col-span-2 p-8 flex flex-col justify-center space-y-4 bg-red-500/5">
              <div className="inline-block px-2 py-1 bg-red-500 text-black text-[10px] font-bold font-cyber w-max uppercase italic animate-bounce">
                New Intel Detected
              </div>
              <h3 className="text-3xl font-cyber font-bold leading-tight">ADVANCED CYBER ATTACK ANALYSIS</h3>
              <p className="text-gray-400">
                Dive deep into real-world hacking scenarios and learn how to defend against the latest digital threats with our premium masterclass. 
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-red-500">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 45:00</span>
                <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> LEVEL: ELITE</span>
              </div>
              <Link to="/videos">
                <CyberButton variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500/10">
                  EXPLORE FULL DATABASE
                </CyberButton>
              </Link>
            </div>
          </div>
        </CyberCard>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-cyber tracking-tight flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyber-blue" />
            CORE MODULES
          </h2>
          <div className="h-px flex-1 mx-6 bg-gradient-to-r from-cyber-blue/30 to-transparent" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.path}>
              <motion.div
                variants={item}
                whileHover={{ y: -5, scale: 1.05 }}
                className="aspect-square glass-morphism border border-white/5 p-4 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:border-cyber-blue/50 transition-all group"
              >
                <cat.icon className={cn("w-10 h-10 group-hover:scale-110 transition-transform", cat.color)} />
                <span className="text-[10px] font-cyber tracking-tighter uppercase">{cat.name}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section className="grid md:grid-cols-3 gap-8">
        <CyberCard className="space-y-4">
          <PlayCircle className="w-12 h-12 text-cyber-blue" />
          <h3 className="text-xl font-bold font-cyber">VIDEO TUTORIALS</h3>
          <p className="text-gray-400 text-sm">Step-by-step guides from basic to advanced ethical hacking tools and techniques.</p>
        </CyberCard>
        <CyberCard className="space-y-4">
          <Download className="w-12 h-12 text-cyber-blue" />
          <h3 className="text-xl font-bold font-cyber">PREMIUM RESOURCES</h3>
          <p className="text-gray-400 text-sm">Access to premium PDF notes, custom scripts, and security tools not available elsewhere.</p>
        </CyberCard>
        <CyberCard className="space-y-4">
          <CreditCard className="w-12 h-12 text-cyber-blue" />
          <h3 className="text-xl font-bold font-cyber">SECURE PLATFORM</h3>
          <p className="text-gray-400 text-sm">One-time payment for lifetime access to the most secure learning environment.</p>
        </CyberCard>
      </section>
    </div>
  );
}

function UserAvatar({ name }: { name?: string | null }) {
  const initial = name ? name.charAt(0).toUpperCase() : 'A';
  return (
    <span className="text-2xl font-cyber text-cyber-blue font-bold">{initial}</span>
  );
}

import { cn } from '../lib/utils';
