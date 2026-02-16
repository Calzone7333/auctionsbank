import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import AuctionCard from '../components/AuctionCard';
import { ArrowRight, Home, Building2, Briefcase, Warehouse, Castle } from 'lucide-react'; // Icons for properties
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

const PropertyTypeCard = ({ icon: Icon, title, count, gradient, textColor, borderColor }) => (
    <Link to={`/auctions?type=${title}`} className={`relative p-8 rounded-3xl bg-white border ${borderColor} shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group h-full flex flex-col items-start justify-between`}>
        {/* Background Gradient Blob */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:scale-150 transition-transform duration-700`}></div>

        <div className={`w-14 h-14 rounded-2xl ${gradient} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-7 w-7 ${textColor}`} />
        </div>

        <div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-2 group-hover:translate-x-1 transition-transform">{title}</h3>
            <p className="text-sm font-medium text-slate-400 group-hover:text-slate-600 transition-colors flex items-center gap-2">
                {count} Properties <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </p>
        </div>
    </Link>
);

const ProcessStep = ({ number, title, desc }) => (
    <div className="relative pl-8 md:pl-0">
        <div className="hidden md:flex absolute -left-4 top-0 items-center justify-center w-8 h-8 rounded-full bg-aq-blue text-white font-bold text-sm shadow-lg z-10">
            {number}
        </div>
        <div className="md:border-l-2 md:border-slate-100 md:pl-12 pb-12">
            <span className="flex md:hidden absolute left-0 top-0 items-center justify-center w-6 h-6 rounded-full bg-aq-blue text-white font-bold text-xs">
                {number}
            </span>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
            <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
        </div>
    </div>
);

const HomePage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalActive: 0,
        typeCounts: {},
        banks: []
    });

    useEffect(() => {
        // Fetch Stats
        fetch(`${API_BASE_URL}/auctions/public/stats`)
            .then(res => res.json())
            .then(data => {
                const typeCountsObj = {};
                if (Array.isArray(data.typeCounts)) {
                    data.typeCounts.forEach(([type, count]) => {
                        typeCountsObj[type] = count;
                    });
                }
                setStats({
                    totalActive: data.totalActive || 0,
                    typeCounts: typeCountsObj,
                    banks: data.banks || []
                });
            })
            .catch(err => console.error("Error fetching stats:", err));

        setLoading(true);
        fetch(`${API_BASE_URL}/auctions`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setAuctions(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch auctions", err);
                setAuctions([]);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Hero />

            {/* Property Types Section */}
            <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <span className="text-aq-gold font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Asset Classes</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
                            Explore Premium <br /> <span className="text-slate-400">Opportunities</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-2">
                        Browse through our diverse portfolio of bank auction assets, from luxury residences to industrial complexes.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PropertyTypeCard
                        icon={Home} title="Residential" count={`${stats.typeCounts["Residential"] || 0}+`}
                        gradient="from-emerald-400 to-teal-500" textColor="text-emerald-600" borderColor="border-emerald-100"
                    />
                    <PropertyTypeCard
                        icon={Briefcase} title="Commercial" count={`${stats.typeCounts["Commercial"] || 0}+`}
                        gradient="from-blue-400 to-indigo-500" textColor="text-blue-600" borderColor="border-blue-100"
                    />
                    <PropertyTypeCard
                        icon={Castle} title="Land & Plots" count={`${stats.typeCounts["Land"] || stats.typeCounts["Land & Plots"] || 0}+`}
                        gradient="from-amber-400 to-orange-500" textColor="text-amber-600" borderColor="border-amber-100"
                    />
                    <PropertyTypeCard
                        icon={Warehouse} title="Industrial" count={`${stats.typeCounts["Industrial"] || 0}+`}
                        gradient="from-slate-400 to-slate-600" textColor="text-slate-600" borderColor="border-slate-100"
                    />
                </div>
            </section>

            {/* Featured Auctions */}
            <section className="bg-white py-24 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                        <div>
                            <span className="text-aq-blue font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Featured Listings</span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900">
                                Latest Auctions
                            </h2>
                        </div>
                        <Link to="/auctions" className="group flex items-center gap-3 px-6 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300">
                            <span className="font-bold text-sm">View All Properties</span>
                            <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-slate-50 rounded-[2rem] h-[450px] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {auctions && auctions.length > 0 ? (
                                auctions.slice(0, 3).map((auction) => (
                                    <div key={auction.id} className="h-full">
                                        <AuctionCard auction={auction} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium">No active auctions found at the moment.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-slate-50 border-t border-white">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-aq-gold font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Simple Process</span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-8 leading-tight">
                                Your journey to a <br />smart investment.
                            </h2>
                            <p className="text-slate-500 mb-10 leading-relaxed max-w-md">
                                We've simplified the complex bank auction process into straightforward steps, ensuring transparency and ease for every investor.
                            </p>

                            <div className="space-y-2">
                                <ProcessStep number="1" title="Search & Select" desc="Browse our curated list of verified bank auction properties and shortlist your favorites." />
                                <ProcessStep number="2" title="Inspect & Verify" desc="Schedule a site visit and review legal documents with our assistance." />
                                <ProcessStep number="3" title="Bid & Win" desc="Participate in the auction securely and bid for your selected property." />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-aq-blue/5 rounded-[2.5rem] transform rotate-3 scale-105 z-0"></div>
                            <img
                                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1973&auto=format&fit=crop"
                                alt="Modern Building"
                                className="relative rounded-[2.5rem] shadow-2xl z-10 w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Stats Card Overlay */}
                            <div className="absolute bottom-10 left-4 md:-left-12 z-20 bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-xs animate-bounce-slow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                        <Home className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Properties</p>
                                        <p className="text-2xl font-bold text-slate-900">{stats.totalActive}+</p>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                                    <div className="bg-green-500 h-1.5 rounded-full w-[85%]"></div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">85% successfully closed this month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-20 border-t border-slate-200 bg-white">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-12">Trusted Banking Partners</p>
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-x-20 gap-y-10 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Partner Logos (Dynamic from active auctions, fallback to defaults if empty) */}
                        {(stats.banks && stats.banks.length > 0 ? stats.banks : ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank']).map((bank) => (
                            <h3 key={bank} className="text-2xl md:text-3xl font-display font-bold text-slate-300 hover:text-slate-800 transition-colors cursor-default select-none">{bank}</h3>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
