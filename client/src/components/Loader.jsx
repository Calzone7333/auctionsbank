import React from 'react';
import { motion } from 'framer-motion';
import { Gavel } from 'lucide-react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px]"></div>

            <div className="relative flex flex-col items-center">
                {/* Main Spinner Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Outer slow spinning border */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-slate-100 rounded-full"
                    />

                    {/* Fast glowing accent border */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-brand-blue rounded-full"
                    />

                    {/* Inner pulsing circle */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-4 bg-brand-blue/10 rounded-full"
                    />

                    {/* Central Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="z-10"
                    >
                        <Gavel className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                    </motion.div>
                </div>

                {/* Brand Text Animation */}
                <div className="mt-12 overflow-hidden flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <motion.span
                            initial={{ letterSpacing: "0.2em" }}
                            animate={{ letterSpacing: "0.6em" }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            className="text-brand-dark text-[10px] font-black uppercase tracking-[0.6em] ml-[0.6em]"
                        >
                            Madrasauction
                        </motion.span>
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-brand-blue to-transparent mt-1"></div>
                        <span className="text-brand-blue text-[7px] font-bold uppercase tracking-[0.4em] ml-[0.4em] mt-1">
                            Property Auctions
                        </span>
                    </motion.div>
                </div>

                {/* Minimal Loading Bar */}
                <div className="mt-8 w-40 h-[1px] bg-slate-100 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-brand-blue to-transparent"
                    />
                </div>
            </div>

            {/* Quote/Loading message */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 text-slate-400 text-[9px] font-medium uppercase tracking-widest"
            >
                Securing Your Future Assets...
            </motion.p>
        </div>
    );
};

export default Loader;
