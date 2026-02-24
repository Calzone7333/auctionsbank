import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    ShieldCheck,
    TrendingUp,
    Globe,
    Users,
    Award,
    ArrowRight,
    MapPin,
    Plus,
    Building2,
    Landmark,
    Home,
    Gavel,
    CheckCircle2,
    Briefcase,
    Warehouse,
    Castle
} from 'lucide-react';

import Hero from '../components/Hero';
import AuctionCard from '../components/AuctionCard';
import { API_BASE_URL } from '../apiConfig';

const TabContent = ({ activeTab }) => {
    const content = {
        'knowledge': {
            title: 'Market Expertise',
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
            desc: 'Our team specializes in the intricate world of bank auctions, providing you with data-driven insights and verified opportunities for high-yield investments.'
        },
        'excellence': {
            title: 'Verified Opportunities',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
            desc: 'We pride ourselves on our rigorous vetting process. Every auction on our platform is sourced from reputable financial institutions and legal channels.'
        },
        'pricing': {
            title: 'Transparent Process',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop',
            desc: 'Real estate investment shouldn\'t be a mystery. We provide clear pricing, EMD details, and legal documentation to ensure a seamless transparent journey.'
        }
    };

    const current = content[activeTab] || content['excellence'];

    return (
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
            <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-blue/10 rounded-full blur-2xl"></div>
                <img src={current.image} alt={current.title} className="rounded-2xl shadow-2xl relative z-10 w-full aspect-video object-cover" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-blue rounded-2xl -z-10"></div>
            </div>
            <div className="space-y-6">
                <h3 className="text-3xl font-display font-bold text-brand-dark">{current.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg italic">"{current.desc}"</p>
                <div className="space-y-4">
                    <p className="text-slate-600">
                        At Madrasauction Property Auctions, we bridging the gap between distressed bank assets and smart investors. Our professionals bring decades of experience in real estate and legal advisory to your fingertips.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const HomePage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('excellence');

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/auctions`)
            .then(res => res.json())
            .then(data => {
                setAuctions(Array.isArray(data) ? data.slice(0, 4) : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching auctions:", err);
                setAuctions([]);
                setLoading(false);
            });
    }, []);

    const stats = [
        { icon: Globe, label: 'Cities Covered', value: '45+' },
        { icon: Users, label: 'Happy Investors', value: '12k+' },
        { icon: MapPin, label: 'Success Rate', value: '94%' },
        { icon: Award, label: 'Expert Support', value: '24/7' },
    ];

    return (
        <div className="bg-white min-h-screen font-sans overflow-x-hidden">
            <Hero />

            {/* Recent Auctions Section */}
            <section className="relative z-20 -mt-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex justify-between items-end mb-8 px-2">
                    <div className="space-y-1">
                        <span className="text-brand-blue font-black tracking-[0.3em] uppercase text-[10px]">New Opportunities</span>
                        <h2 className="text-3xl font-display font-black text-brand-dark uppercase tracking-tight">Recent Auctions</h2>
                    </div>
                    <Link to="/auctions" className="text-brand-blue font-black uppercase text-[10px] tracking-widest hover:text-brand-dark transition-colors flex items-center gap-2 border-b-2 border-brand-blue pb-1">
                        View All Listings <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="h-[280px] bg-slate-50 animate-pulse rounded-xl border border-slate-100"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {auctions.map((auction) => (
                            <motion.div
                                key={auction.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <AuctionCard auction={auction} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-brand-dark mb-8 uppercase tracking-tight">Why Choose Madrasauction?</h2>
                        <div className="flex justify-center items-center gap-8 md:gap-16 border-b border-slate-100 pb-4">
                            {[
                                { id: 'knowledge', label: 'Market Expertise' },
                                { id: 'excellence', label: 'Verified Status' },
                                { id: 'pricing', label: 'Transparency' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative pb-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-brand-blue' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <TabContent activeTab={activeTab} />
                    </AnimatePresence>
                </div>
            </section>

            {/* Investment Difference Section */}
            <section className="py-24 bg-brand-light">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6 leading-tight uppercase tracking-tight">
                                Investment Portal With a Difference. <br />
                                <span className="text-brand-blue italic">Innovation.</span>
                            </h2>
                            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                                Madrasauction Property Auctions is localized as one of the leader's groups in the bank auction and real estate investment services. We continue to expand our horizons by providing innovative digital solutions supported by deep legal expertise.
                            </p>
                            <div className="space-y-2">
                                <h4 className="font-bold text-brand-dark uppercase tracking-wider">Our Commitment</h4>
                                <p className="text-slate-400 text-sm italic">Excellence in every bid.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                {
                                    title: 'Asset Portfolio',
                                    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
                                    desc: "Explore a vast portfolio of residential and commercial assets from leading banks."
                                },
                                {
                                    title: 'Strategic Insights',
                                    img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop',
                                    desc: "Get professional analysis on market valuation and future growth potential."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                    <div className="h-48 overflow-hidden">
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <h3 className="font-black text-brand-dark text-lg uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                                        <button className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white hover:scale-110 transition-transform">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Unmatched Opportunities Section */}
            <section className="py-24 bg-brand-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                    <Globe size={800} className="text-white" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="lg:col-span-1">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 leading-[1.2] uppercase tracking-tight">
                                Expert Help. <br />
                                <span className="text-brand-light/40">High Returns.</span>
                            </h2>
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-brand-blue transition-colors cursor-pointer group">
                                <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                            </div>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { icon: Landmark, title: 'BANK AUCTIONS', desc: 'Secure properties directly from bank inventory at competitive reserve prices.' },
                                { icon: Building2, title: 'RESIDENTIAL', desc: 'Find your dream home or rental investment from a verified list of apartments and houses.' },
                                { icon: Home, title: 'COMMERCIAL', desc: 'Office spaces, retail shops, and warehouses for your business growth.' },
                                { icon: MapPin, title: 'INDUSTRIAL', desc: 'Strategic industrial plots and manufacturing units ready for acquisition.' }
                            ].map((service, idx) => (
                                <div key={idx} className="border border-white/10 p-8 rounded-xl hover:bg-white/5 transition-colors group">
                                    <div className="flex gap-6 items-start">
                                        <div className="pt-1">
                                            <service.icon size={32} className="text-brand-blue group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-white uppercase tracking-wider">{service.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="grid grid-cols-2 gap-x-12 gap-y-16">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="space-y-2">
                                    <span className="text-5xl font-bold text-brand-dark">{stat.value}</span>
                                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <img src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070&auto=format&fit=crop" alt="Digital Map" className="w-full opacity-80" />
                            <div className="absolute top-1/2 left-1/3 animate-ping">
                                <MapPin size={24} className="text-brand-blue" />
                            </div>
                            <div className="absolute top-1/4 left-2/3 animate-ping">
                                <MapPin size={24} className="text-brand-blue" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
