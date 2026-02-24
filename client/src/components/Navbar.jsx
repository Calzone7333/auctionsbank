import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, User, ChevronDown, Gavel, Ship, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navRef = useRef(null);
    const navigate = useNavigate();

    const location = useLocation();

    const openAuthModal = (mode = 'login') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
        setIsOpen(false); // Close mobile menu if open
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Auctions', path: '/auctions' },
        { name: 'About Us', path: '/about' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <div className="w-full relative z-50 font-sans">
            {/* Top Bar - Dark Blue */}
            <div className="bg-brand-dark text-white py-2 hidden lg:block">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center text-[11px] font-bold tracking-widest uppercase">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-brand-blue" />
                            <span>+91 96557 71091</span>
                        </div>
                        <a href="mailto:info@madrasauction.com" className="flex items-center gap-2 group cursor-pointer">
                            <Mail className="h-4 w-4 text-brand-blue group-hover:scale-110 transition-transform" />
                            <span className="group-hover:text-brand-blue transition-colors underline decoration-brand-blue decoration-2 underline-offset-4">info@madrasauction.com</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navbar - White */}
            <nav
                ref={navRef}
                className={`w-full bg-white border-b border-slate-50 transition-all duration-300 ${scrolled ? 'fixed top-0 shadow-lg py-1' : 'relative py-4'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center justify-center h-12 w-12 bg-brand-dark rounded-full text-white shadow-xl shadow-brand-blue/20 transform hover:rotate-12 transition-transform">
                                <Gavel className="h-7 w-7 text-brand-blue" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-brand-dark leading-none tracking-tighter uppercase">
                                    Madrasauction
                                </span>
                                <span className="text-[10px] font-bold text-brand-blue tracking-[0.2em] uppercase">
                                    Property Auctions
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-6 ml-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`text-[13px] font-black uppercase tracking-widest transition-all duration-300 relative group ${location.pathname === item.path
                                        ? 'text-brand-blue'
                                        : 'text-brand-dark hover:text-brand-blue'
                                        }`}
                                >
                                    {item.name}
                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-brand-blue transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 ${location.pathname === item.path ? 'scale-x-100' : ''}`} />
                                </Link>
                            ))}
                        </div>

                        {/* Right Side CTA */}
                        <div className="hidden lg:flex items-center gap-6 ml-10">
                            {!user ? (
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => openAuthModal('login')}
                                        className="text-[13px] font-black uppercase tracking-widest text-brand-dark hover:text-brand-blue transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => openAuthModal('register')}
                                        className="bg-brand-blue text-white px-6 py-2 rounded-md text-[12px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-blue/20"
                                    >
                                        Register
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="relative group"
                                        onMouseEnter={() => setIsProfileMenuOpen(true)}
                                        onMouseLeave={() => setIsProfileMenuOpen(false)}
                                    >
                                        <button
                                            className="flex items-center gap-2 p-2 bg-slate-50 text-brand-blue hover:bg-blue-50 rounded-lg transition-all border border-slate-100"
                                        >
                                            <span className="text-[10px] hidden md:block font-bold text-slate-600 uppercase tracking-wider">{user.role}</span>
                                            <div className="bg-white p-1 rounded-full shadow-sm">
                                                <User className="h-4 w-4" />
                                            </div>
                                        </button>

                                        <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                            <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                                                <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                                                    <p className="text-xs font-bold text-slate-700 truncate mt-0.5">{user.email}</p>
                                                </div>
                                                <div className="p-1">
                                                    {user.role === 'ADMIN' && (
                                                        <Link
                                                            to="/admin-dashboard"
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-aq-blue hover:bg-blue-50 rounded-lg font-medium transition-colors"
                                                        >
                                                            <Gavel className="w-4 h-4" />
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={logout}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors text-left"
                                                    >
                                                        <User className="w-4 h-4 rotate-180" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex items-center lg:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-aq-gold hover:bg-yellow-50"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                                    {!user ? (
                                        <button
                                            onClick={() => openAuthModal('login')}
                                            className="block w-full text-center px-4 py-3 rounded-md text-base font-medium text-aq-blue bg-blue-50 hover:bg-blue-100"
                                        >
                                            Login / Register
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="px-3 py-2 text-sm text-center text-gray-500 bg-gray-50 rounded-md">
                                                Signed in as <span className="font-bold text-gray-700 block">{user.email}</span>
                                            </div>
                                            {user.role === 'ADMIN' && (
                                                <Link
                                                    to="/admin-dashboard"
                                                    className="block w-full text-center px-4 py-3 rounded-md text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsOpen(false);
                                                }}
                                                className="block w-full text-center px-4 py-3 rounded-md text-base font-medium text-red-600 bg-red-50 hover:bg-red-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
};

export default Navbar;
