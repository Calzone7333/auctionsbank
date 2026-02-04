import React from 'react';
import { Target, Users, Shield, TrendingUp, Award, Globe } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Hero Section */}
            <div className="bg-aq-blue text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="text-aq-gold font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8">
                        Redefining Property Auctions in India
                    </h1>
                    <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed font-light">
                        Aquection is India's premier aggregator for bank auction properties. We bridge the gap between financial institutions and investors, bringing transparency, trust, and technology to the forefront of distressed asset liquidation.
                    </p>
                </div>
            </div>

            {/* Mission & Vision Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-6 relative">
                            Our Mission
                            <span className="block h-1 w-20 bg-aq-gold mt-2"></span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            To democratize access to high-value real estate assets by simplifying the complex world of bank auctions. We aim to empower every Indian investor with the data and tools needed to make informed decisions.
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            We believe that purchasing a bank auction property shouldn't be a daunting task filled with legal ambiguity, but a streamlined, transparent, and rewarding investment journey.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
                                alt="Team meeting"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-full">
                                    <TrendingUp className="h-8 w-8 text-aq-blue" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Growth</p>
                                    <p className="text-2xl font-bold text-slate-900">120% YoY</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-white py-20 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Our Core Values</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">The principles that guide every decision we make.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-aq-blue transition-colors">
                                <Shield className="h-7 w-7 text-aq-blue group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Transparency</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We provide complete, unfiltered information about every property. No hidden costs, no fine print surprises.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-aq-gold transition-colors">
                                <Target className="h-7 w-7 text-yellow-700 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Accuracy</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Data integrity is our religion. Our team verifies every listing against official bank notifications daily.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                                <Users className="h-7 w-7 text-green-700 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Customer First</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We measure our success not by sales, but by the wealth created for our community of investors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-aq-blue rounded-3xl p-12 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-aq-gold/10 pointer-events-none"></div>
                    <div className="relative z-10">
                        <p className="text-4xl lg:text-5xl font-bold mb-2">5000+</p>
                        <p className="text-sm lg:text-base text-slate-300 font-medium">Properties Listed</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-4xl lg:text-5xl font-bold mb-2">50+</p>
                        <p className="text-sm lg:text-base text-slate-300 font-medium">Partner Banks</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-4xl lg:text-5xl font-bold mb-2">10k+</p>
                        <p className="text-sm lg:text-base text-slate-300 font-medium">Active Investors</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-4xl lg:text-5xl font-bold mb-2">₹200Cr+</p>
                        <p className="text-sm lg:text-base text-slate-300 font-medium">Asset Value Sold</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;
