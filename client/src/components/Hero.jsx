import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative h-[85vh] min-h-[500px] w-full overflow-hidden">

            {/* Static Background Image with subtle Ken Burns */}
            <div className="absolute inset-0">
                <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: 'easeOut' }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/Platsimage.png')" }}
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-brand-dark/55 bg-gradient-to-r from-brand-dark/85 via-brand-dark/50 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className="space-y-6 max-w-3xl"
                >


                    {/* Heading */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white leading-[1.1] uppercase tracking-tight">
                        Secure Prime Bank Auctions
                    </h1>

                    {/* Description */}
                    <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
                        Direct access to verified distressed assets, residential plots, and commercial spaces across India. Professional guidance for your next big investment.
                    </p>

                    {/* Buttons */}
                    <div className="pt-6 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/auctions"
                            className="bg-brand-blue text-white px-8 py-4 rounded-md font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:bg-white hover:text-brand-dark"
                        >
                            Browse Listings
                        </Link>
                        <Link
                            to="/about"
                            className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-md font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-brand-dark"
                        >
                            Learn More
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Gradient for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 to-transparent" />
        </div>
    );
};

export default Hero;
