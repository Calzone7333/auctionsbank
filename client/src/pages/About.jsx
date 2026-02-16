import React from 'react';
import { Target, Users, Shield, TrendingUp, Award, Globe, Rocket, Heart, BookOpen, Clock, CheckCircle } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* Minimalist Hero */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">Who we are</span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                    Making bank auctions <br /> accessible to everyone.
                </h1>
                <p className="max-w-3xl mx-auto text-xl text-slate-500 leading-relaxed font-light">
                    Madrasauction is an intelligent data platform that simplifies the process of finding, analyzing, and purchasing distressed assets in India.
                </p>
            </div>

            {/* Why Choose Us - Alternating Sections */}
            <div className="space-y-24 py-16">

                {/* Section 1 */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Transparency is our currency.</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                The auction market has traditionally been opaque, with information buried in newspapers and obscure websites. We change that.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-blue-600 mr-3 shrink-0" />
                                    <span className="text-slate-700">Centralized database of auctions from all major banks.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-blue-600 mr-3 shrink-0" />
                                    <span className="text-slate-700">Rigorous verification process to weed out expired listings.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="h-64 lg:h-96 bg-slate-100 rounded-3xl overflow-hidden relative shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
                                    alt="Transparency and Trust"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-blue-900/10"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-1">
                            <div className="h-64 lg:h-96 bg-slate-100 rounded-3xl overflow-hidden relative shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                                    alt="Data Driven Analytics"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-emerald-900/10"></div>
                            </div>
                        </div>
                        <div className="order-2">
                            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Data-driven decisions.</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                We don't just show you listings; we provide the context you need to make smart investment choices.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 mr-3 shrink-0" />
                                    <span className="text-slate-700">Market price comparisons for similar properties.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 mr-3 shrink-0" />
                                    <span className="text-slate-700">Legal status indicators and document checklists.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            {/* Stats Band */}
            <div className="bg-slate-900 py-20 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                        <div>
                            <p className="text-4xl lg:text-5xl font-bold text-white mb-2">5K+</p>
                            <p className="text-slate-400">Auctions Listed</p>
                        </div>
                        <div>
                            <p className="text-4xl lg:text-5xl font-bold text-white mb-2">50+</p>
                            <p className="text-slate-400">Cities Covered</p>
                        </div>
                        <div>
                            <p className="text-4xl lg:text-5xl font-bold text-white mb-2">₹200Cr</p>
                            <p className="text-slate-400">Assets Valued</p>
                        </div>
                        <div>
                            <p className="text-4xl lg:text-5xl font-bold text-white mb-2">24/7</p>
                            <p className="text-slate-400">Support Team</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 text-center bg-slate-50">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to find your next investment?</h2>
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
                    Explore Auctions Now
                </button>
            </div>
        </div>
    );
};

export default About;
