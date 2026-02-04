import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    const [currentImage, setCurrentImage] = useState(0);

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

    return (
        <div className="relative font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Rounded Hero Container */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-aq-blue">

                {/* Background Carousel */}
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

                {/* Content Container - Relative Flex Column */}
                <div className="relative flex flex-col justify-between min-h-[550px] lg:h-[550px]">

                    {/* Top Spacer/Header Area */}
                    <div className="hidden lg:block h-8"></div>

                    {/* Main Text Content */}
                    <div className="flex-1 flex flex-col items-center justify-start text-center px-4 pt-8 pb-10">
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
                            className="text-2xl md:text-3xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg"
                        >
                            Invest Today in Your Dream Home
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-sm md:text-lg text-gray-100 mb-8 max-w-lg mx-auto font-light drop-shadow-md px-2 leading-relaxed"
                        >
                            Unlock exclusive bank auction properties across India at unbeatable prices.<br className="hidden md:block" />
                            Secure Residential, Commercial, and Industrial assets today.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <button className="bg-aq-gold hover:bg-yellow-600 text-white px-8 py-3.5 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-1 w-full sm:w-auto">
                                View Property
                            </button>
                            <button className="bg-transparent border border-white/50 text-white hover:bg-white/10 px-8 py-3.5 rounded-lg font-bold backdrop-blur-sm transition-all w-full sm:w-auto">
                                Contact Now
                            </button>
                        </motion.div>
                    </div>

                    {/* Search Bar - Bottom */}
                    <div className="w-full px-4 md:px-12 lg:px-20 pb-20 lg:pb-40 text-left">
                        <div className="bg-white rounded-2xl p-3 shadow-2xl flex flex-col lg:flex-row gap-3 items-center">

                            {/* Keyword */}
                            <div className="w-full lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-gray-100 p-1">
                                <label className="block lg:hidden text-xs font-bold text-gray-400 uppercase mb-1 ml-3 mt-1">Keywords</label>
                                <input
                                    type="text"
                                    placeholder="Enter keywords"
                                    className="w-full bg-slate-50 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-aq-gold text-gray-700 font-medium placeholder-gray-400"
                                />
                            </div>

                            {/* Filters Grid for Mobile */}
                            <div className="w-full lg:contents grid grid-cols-2 gap-2">
                                {/* Sell or Rent */}
                                <div className="w-full lg:w-auto lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-gray-100 p-1">
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-aq-gold text-gray-700 font-medium appearance-none cursor-pointer">
                                            <option>Sell or Rent</option>
                                            <option>Buy</option>
                                            <option>Rent</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Property Type */}
                                <div className="w-full lg:w-auto lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-gray-100 p-1">
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-aq-gold text-gray-700 font-medium appearance-none cursor-pointer">
                                            <option>Type</option>
                                            <option>Residential</option>
                                            <option>Commercial</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="w-full lg:w-auto lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-gray-100 p-1">
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-aq-gold text-gray-700 font-medium appearance-none cursor-pointer">
                                            <option>Location</option>
                                            <option>Mumbai</option>
                                            <option>Delhi</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="w-full lg:w-auto lg:flex-1 relative p-1">
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-aq-gold text-gray-700 font-medium appearance-none cursor-pointer">
                                            <option>Amenities</option>
                                            <option>Parking</option>
                                            <option>Pool</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="w-full lg:w-auto p-1">
                                <button className="w-full lg:w-auto bg-aq-gold hover:bg-yellow-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2">
                                    <Search className="h-5 w-5" />
                                    <span className="lg:hidden">Search Properties</span>
                                    <span className="hidden lg:inline">Search</span>
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
