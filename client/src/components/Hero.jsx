import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, ChevronDown, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

const Hero = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [auctions, setAuctions] = useState([]);
    const navigate = useNavigate();

    // Search State
    const [keyword, setKeyword] = useState('');
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');

    const images = [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', // Luxury Home
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', // Commercial Building
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop', // Luxury Car
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop', // Land / Plot
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(timer);
    }, [images.length]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/auctions`)
            .then(res => res.json())
            .then(data => {
                setAuctions(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error("Error fetching auctions for hero:", err));
    }, []);

    // Extract unique values safely
    const cities = auctions && Array.isArray(auctions)
        ? [...new Set(auctions.filter(a => a?.cityName).map(a => a.cityName))].sort()
        : [];
    const types = auctions && Array.isArray(auctions)
        ? [...new Set(auctions.filter(a => a?.propertyType).map(a => a.propertyType))].sort()
        : [];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.append('search', keyword);
        if (type && type !== 'Property Type') params.append('type', type);
        if (location && location !== 'Location') params.append('city', location);
        navigate(`/auctions?${params.toString()}`);
    };

    return (
        <div className="relative font-sans max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 mb-12">

            {/* Main Wrapper - Hero Image Area */}
            <div className="relative w-full h-[85vh] min-h-[500px] max-h-[800px] rounded-[2.5rem] shadow-2xl overflow-visible bg-aq-blue">
                {/* Background Carousel */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden z-0">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                            style={{ backgroundImage: `url('${img}')` }}
                        >
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-slate-900/40 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20"></div>
                        </div>
                    ))}
                </div>

                {/* Centered Content */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pb-20 sm:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 mb-4 md:mb-6"
                    >
                        <span className="text-white/80 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.3em] uppercase border-b border-white/20 pb-1">Welcome to Aquection</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg max-w-[95%] md:max-w-5xl mx-auto"
                    >
                        Invest Today in Your Dream Home
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-white/90 text-sm sm:text-base md:text-lg max-w-[90%] md:max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-light"
                    >
                        Explore verified bank auction properties across India. Transparent, secure, and profitable investments await.
                    </motion.p>


                </div>

                {/* Floating Search Bar Section - Positioned absolute overlapping the bottom */}
                <div className="absolute bottom-10 md:bottom-20 left-0 right-0 z-20 px-4 md:px-8">
                    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-4 md:p-3 ring-1 ring-slate-100">
                        <div className="flex flex-col md:flex-row gap-3 items-center">

                            {/* Keyword Input */}
                            <div className="w-full md:flex-[2] relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#EF782A] transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Bank, City, or Title..."
                                    className="w-full h-12 md:h-14 pl-10 md:pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#EF782A] focus:ring-1 focus:ring-[#EF782A] focus:bg-white transition-all placeholder:text-slate-400"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>

                            {/* Location Select */}
                            <div className="w-full md:flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-[#EF782A] transition-colors" />
                                </div>
                                <select
                                    className="w-full h-12 md:h-14 pl-10 md:pl-12 pr-10 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-[#EF782A] focus:ring-1 focus:ring-[#EF782A] focus:bg-white transition-all"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="">All Cities</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Property Type Select */}
                            <div className="w-full md:flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-[#EF782A] transition-colors" />
                                </div>
                                <select
                                    className="w-full h-12 md:h-14 pl-10 md:pl-12 pr-10 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-[#EF782A] focus:ring-1 focus:ring-[#EF782A] focus:bg-white transition-all"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    {types.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Search Button */}
                            <div className="w-full md:w-auto flex-shrink-0">
                                <button
                                    onClick={handleSearch}
                                    className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 bg-[#EF782A] hover:bg-[#d6651d] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    Search
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Hero;
