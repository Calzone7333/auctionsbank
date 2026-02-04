import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import AuctionCard from '../components/AuctionCard';
import { ArrowRight, Home, Building2, Briefcase, Warehouse, Castle } from 'lucide-react'; // Icons for properties
import { Link } from 'react-router-dom';

const PropertyTypeCard = ({ icon: Icon, title, count }) => (
    <Link to={`/auctions?type=${title}`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-aq-blue transition-colors">
            <Icon className="h-8 w-8 text-slate-600 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-aq-blue transition-colors mb-1">{title}</h3>
        <p className="text-sm text-slate-500">{count} Properties</p>
    </Link>
);

const HomePage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Using fetch to get real data, fallback to empty array handled
        fetch('http://localhost:8080/api/auctions')
            .then(res => res.json())
            .then(data => {
                setAuctions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch auctions", err);
                setLoading(false);
                // In production, maybe show error toast or fallback UI
            });
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Hero />

            {/* Property Types Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-10">
                <div className="text-center mb-12">
                    <span className="text-aq-gold font-bold tracking-widest uppercase text-xs">Property Types</span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2">Explore Asset Classes</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <PropertyTypeCard icon={Home} title="Residential" count="120" />
                    <PropertyTypeCard icon={Building2} title="Apartments" count="85" />
                    <PropertyTypeCard icon={Briefcase} title="Commercial" count="42" />
                    <PropertyTypeCard icon={Castle} title="Land" count="30" />
                    <PropertyTypeCard icon={Warehouse} title="Industrial" count="18" />
                </div>
            </section>

            {/* Featured Auctions Section */}
            <section className="bg-white py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-aq-blue font-bold tracking-widest uppercase text-xs">Properties</span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2">Featured Auctions</h2>
                        </div>
                        <Link to="/auctions" className="hidden sm:flex items-center text-aq-gold hover:text-yellow-600 font-bold text-sm">
                            View All Properties <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aq-gold"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                            {auctions.slice(0, 3).map((auction) => (
                                <div key={auction.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                                    <AuctionCard auction={auction} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 sm:hidden text-center">
                        <Link to="/auctions" className="inline-block px-6 py-3 border border-aq-gold text-aq-gold font-bold rounded-md hover:bg-yellow-50 transition-colors">
                            View All Properties
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Section - Sourcing Partners */}
            {/* <section className="bg-white py-16 border-t border-slate-100">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-aq-gold font-bold tracking-widest uppercase text-xs">Official Partners</span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mt-2 mb-10">
                        Sourcing auctions from top financial institutions
                    </h2>
                    
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                         
                         <div className="group flex items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-lg">S</span>
                            </div>
                            <span className="text-xl font-bold text-slate-600 group-hover:text-blue-800">SBI</span>
                         </div>

                         <div className="group flex items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center">
                                <span className="text-red-600 font-bold text-lg">H</span>
                            </div>
                            <span className="text-xl font-bold text-slate-600 group-hover:text-red-800">HDFC</span>
                         </div>

                         <div className="group flex items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-lg">I</span>
                            </div>
                            <span className="text-xl font-bold text-slate-600 group-hover:text-orange-800">ICICI</span>
                         </div>

                         <div className="group flex items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-yellow-600/10 flex items-center justify-center">
                                <span className="text-yellow-600 font-bold text-lg">P</span>
                            </div>
                            <span className="text-xl font-bold text-slate-600 group-hover:text-yellow-800">PNB</span>
                         </div>

                         <div className="group flex items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-rose-600/10 flex items-center justify-center">
                                <span className="text-rose-600 font-bold text-lg">A</span>
                            </div>
                            <span className="text-xl font-bold text-slate-600 group-hover:text-rose-800">AXIS</span>
                         </div>
                    </div>
                 </div>
            </section> */}
        </div>
    );
};

export default HomePage;
