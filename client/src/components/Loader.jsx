import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
            <div className="relative">
                {/* Main Brand Animation */}
                <div className="relative w-32 h-32 flex items-center justify-center">

                    {/* Pulsing Outer Ring */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 border-[1px] border-aq-blue rounded-full"
                    />

                    {/* Rotating Tracking Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-4 border-aq-gold rounded-full"
                    />

                    {/* Spinning Inner Ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-b-2 border-aq-blue/30 rounded-full"
                    />

                    {/* Central Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        className="relative z-10 bg-aq-blue p-5 rounded-[2rem] shadow-2xl shadow-blue-900/20"
                    >
                        <svg className="w-10 h-10 text-aq-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m14.5 12.5-8 8a2.11 2.11 0 1 1-3-3l8-8" />
                            <path d="m16 16 2 2" />
                            <path d="m2 2 3.5 3.5" />
                            <path d="m15 2 6 6" />
                            <path d="M9 11l6-6" />
                        </svg>
                    </motion.div>
                </div>

                {/* Minimal Dots Below Animation */}
                <div className="flex justify-center gap-2 mt-12">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-2 h-2 bg-aq-gold rounded-full shadow-sm"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Loader;
