import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, User, ChevronDown, Gavel } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    // Mock State
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Auctions', path: '/auctions' },
        { name: 'Banks', path: '/banks' },
        { name: 'Plans', path: '/plans' },
        { name: 'Blog', path: '/blogs' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <div className="w-full relative z-50 font-sans">
            {/* Top Bar - Dark Blue */}
            <div className="bg-aq-blue text-white py-2.5 hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs font-medium tracking-wide">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-aq-gold p-1 rounded-full">
                                <Phone className="h-3 w-3 text-white" />
                            </div>
                            <span>(+91) 78785 35701</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-aq-gold p-1 rounded-full">
                                <Mail className="h-3 w-3 text-white" />
                            </div>
                            <span>info@aquection.com</span>
                        </div>
                    </div>
                    <div>
                        {!isLoggedIn ? (
                            <Link to="/login" className="hover:text-aq-gold transition-colors">Login / Register</Link>
                        ) : (
                            <Link to="/dashboard" className="hover:text-aq-gold transition-colors">My Dashboard</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navbar - White */}
            <nav
                className={`w-full bg-white transition-all duration-300 ${scrolled ? 'fixed top-0 shadow-lg py-2' : 'relative py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="flex items-center justify-center h-10 w-10 bg-aq-blue rounded-lg text-white">
                                <Gavel className="h-6 w-6 text-aq-gold" />
                            </div>
                            <span className="text-2xl font-bold text-aq-blue tracking-tight font-display">
                                Aquection<span className="text-aq-gold">.</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation - Centered */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`text-sm font-semibold transition-colors duration-200 ${location.pathname === item.path
                                            ? 'text-aq-gold'
                                            : 'text-gray-600 hover:text-aq-gold'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side CTA */}
                        <div className="hidden lg:flex items-center">
                            <Link
                                to="/plans"
                                className="bg-aq-gold hover:bg-yellow-600 text-white px-6 py-3 rounded-md text-sm font-bold shadow-md transform transition-transform hover:-translate-y-0.5"
                            >
                                Premium Plans
                            </Link>
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
                {isOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50">
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
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <Link
                                    to="/plans"
                                    className="block w-full text-center bg-aq-gold text-white px-4 py-3 rounded-md font-bold hover:bg-yellow-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Premium Plans
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
