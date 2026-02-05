import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const navigate = useNavigate();

    // Search State
    const [keyword, setKeyword] = useState('');
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    // const [amenities, setAmenities] = useState(''); // Not using yet for basic filter

    const images = [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', // Luxury Home
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop', // Luxury Car
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop', // Land / Plot
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', // Commercial Building
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(timer);
    }, [images.length]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.append('search', keyword);
        if (type && type !== 'Type') params.append('type', type);
        if (location && location !== 'Location') params.append('city', location);

        navigate(`/auctions?${params.toString()}`);
    };

    return (
        <div className="relative font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 mb-12">
            {/* Main Wrapper - No overflow hidden to allow search bar to protrude */}
            <div className="relative w-full rounded-[2.5rem] shadow-2xl bg-aq-blue">

                {/* Background Carousel Container - Handles clipping and border radius */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden z-0">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{ backgroundImage: `url('${img}')` }}
                        >
                            {/* Dark Overlay with Gradient */}
                            <div className="absolute inset-0 bg-aq-blue/40 bg-gradient-to-t from-aq-blue/90 via-transparent to-aq-blue/20"></div>
                        </div>
                    ))}
                </div>

                {/* Content Container - Relative Flex Column */}
                <div className="relative z-10 flex flex-col justify-between min-h-[550px] lg:h-[550px]">

                    {/* Top Spacer/Header Area */}
                    <div className="hidden lg:block h-8"></div>

                    {/* Main Text Content */}
                    <div className="flex-1 flex flex-col items-center justify-start text-center px-4 pt-16 pb-10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                        >
                            Welcome to Aquection Unik
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight drop-shadow-xl"
                        >
                            Invest Today in Your Dream Home
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base md:text-lg text-gray-100 mb-8 max-w-lg mx-auto font-light drop-shadow-md px-2 leading-relaxed"
                        >
                            Unlock exclusive bank auction properties across India at unbeatable prices.<br />
                            Secure Residential, Commercial, and Industrial assets today.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <button
                                onClick={() => navigate('/auctions')}
                                className="bg-aq-gold hover:bg-yellow-600 text-white px-8 py-3.5 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-1 w-full sm:w-auto"
                            >
                                View Property
                            </button>
                            <button className="bg-transparent border border-white/50 text-white hover:bg-white/10 px-8 py-3.5 rounded-lg font-bold backdrop-blur-sm transition-all w-full sm:w-auto">
                                Contact Now
                            </button>
                        </motion.div>
                    </div>

                    {/* Search Bar - Compact & Floating */}
                    <div className="w-full px-4 md:px-8 absolute bottom-0 translate-y-1/2 left-0 z-20">
                        <div className="max-w-5xl mx-auto bg-white rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 mb-6 md:mb-0">

                            {/* Keyword */}
                            <div className="flex-1 relative group w-full">
                                <label className="hidden md:block absolute top-2 left-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keyword</label>
                                <input
                                    type="text"
                                    placeholder="Search properties..."
                                    className="w-full bg-transparent border-none rounded-full px-6 py-4 md:pt-6 md:pb-2 text-sm text-slate-700 font-bold placeholder-gray-400 focus:ring-0 outline-none"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            {/* Property Type */}
                            <div className="flex-1 relative group w-full">
                                <label className="hidden md:block absolute top-2 left-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-transparent border-none rounded-full px-6 py-4 md:pt-6 md:pb-2 text-sm text-slate-700 font-bold appearance-none cursor-pointer focus:ring-0 outline-none"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Industrial">Industrial</option>
                                        <option value="Land">Land</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex-1 relative group w-full">
                                <label className="hidden md:block absolute top-2 left-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-transparent border-none rounded-full px-6 py-4 md:pt-6 md:pb-2 text-sm text-slate-700 font-bold appearance-none cursor-pointer focus:ring-0 outline-none"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    >
                                        <option value="">All Cities</option>
                                        <option value="Chennai">Chennai</option>
                                        <option value="Coimbatore">Coimbatore</option>
                                        <option value="Madurai">Madurai</option>
                                        <option value="Salem">Salem</option>
                                        <option value="Trichy">Trichy</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="p-1 w-full md:w-auto">
                                <button
                                    onClick={handleSearch}
                                    className="w-full md:w-auto h-12 md:h-full md:aspect-square bg-aq-blue hover:bg-slate-800 text-white rounded-full shadow-md transition-all flex items-center justify-center group mt-2 md:mt-0"
                                >
                                    <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
