import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Video, FileText, User, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CyberButton } from './CyberComponents';
import { useState } from 'react';

export function Navbar() {
  const { user, isAdmin, login, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Shield },
    { name: 'Tutorials', path: '/videos', icon: Video },
    { name: 'Paid Section', path: '/resources', icon: FileText },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin', icon: LayoutDashboard });
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-morphism border-b border-cyber-blue/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue flex items-center justify-center animate-pulse">
            <Shield className="w-5 h-5 text-cyber-blue " />
          </div>
          <span className="font-cyber font-bold text-xl tracking-tighter hidden sm:block">
            DNSDJ <span className="text-cyber-blue">CYBER</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-cyber hover:text-cyber-blue transition-colors ${
                location.pathname === item.path ? 'text-cyber-blue' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-700">
              <Link to="/profile" className="w-8 h-8 rounded-full bg-cyber-blue/10 border border-cyber-blue flex items-center justify-center">
                <User className="w-4 h-4 text-cyber-blue" />
              </Link>
              <button onClick={logout} className="text-gray-400 hover:text-white">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <CyberButton onClick={login}>ACCESS LOGIN</CyberButton>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-cyber-blue">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:hidden fixed inset-0 top-16 bg-cyber-black/95 z-40 p-4"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <item.icon className="w-6 h-6 text-cyber-blue" />
                <span className="font-cyber">{item.name}</span>
              </Link>
            ))}
            {!user && (
              <CyberButton onClick={() => { login(); setIsOpen(false); }}>LOGIN</CyberButton>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
