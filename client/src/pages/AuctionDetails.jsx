import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building2, Calendar, IndianRupee, FileText, ArrowLeft, Share2, Heart, ShieldCheck, Info, Download, PhoneCall } from 'lucide-react';

const AuctionDetails = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetching auction detail
        fetch(`http://localhost:8080/api/auctions/${id}`)
            .then(res => res.json())
            .then(data => {
                setAuction(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching auction details:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aq-blue"></div>
                <p className="mt-4 text-slate-500 font-medium">Loading property details...</p>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] bg-slate-50 px-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Property Not Found</h2>
                    <p className="text-slate-500 mb-6">The auction you are looking for might have been removed or expired.</p>
                    <Link to="/auctions" className="inline-flex items-center px-6 py-3 bg-aq-blue text-white rounded-xl font-bold hover:bg-blue-900 transition-all">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Auctions
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link to="/auctions" className="inline-flex items-center text-slate-500 hover:text-aq-blue transition-colors text-sm font-semibold group">
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to All Auctions
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Content Area (Column 1-8) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Header Box */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            {/* Image Header / Banner Placeholder */}
                            <div className="h-64 sm:h-96 relative overflow-hidden bg-slate-900">
                                <img
                                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop"
                                    className="w-full h-full object-cover opacity-60"
                                    alt="Property"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 bg-aq-gold text-white text-xs font-bold rounded-full uppercase tracking-wider">{auction.propertyType}</span>
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> Bank Verified
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                                        {auction.title}
                                    </h1>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 py-6 border-b border-gray-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reserve Price</p>
                                        <p className="text-xl font-bold text-aq-blue">₹{new Intl.NumberFormat('en-IN').format(auction.reservePrice)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">EMD Amount</p>
                                        <p className="text-xl font-bold text-slate-700">₹{new Intl.NumberFormat('en-IN').format(auction.emdAmount)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auction Date</p>
                                        <p className="text-lg font-bold text-slate-700">{new Date(auction.auctionDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">City</p>
                                        <p className="text-lg font-bold text-slate-700">{auction.cityName}</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center">
                                    <Info className="w-5 h-5 mr-2 text-aq-blue" /> Property Description
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
                                    {auction.description || "Detailed description for this bank auction property is currently available in the official notice. This property is being auctioned as part of bank recovery processes. Interested bidders are advised to review the official documents carefully."}
                                </p>
                            </div>
                        </div>

                        {/* Location / Bank Details Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Execution & Bank Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <Building2 className="w-6 h-6 text-aq-blue" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mortgagee Bank</p>
                                        <p className="text-slate-900 font-bold">{auction.bankName}</p>
                                        <p className="text-slate-500 text-sm">Official SARFAESI Proceeding</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Asset Location</p>
                                        <p className="text-slate-900 font-bold">{auction.cityName}, India</p>
                                        <p className="text-slate-500 text-sm">Review full address in notice</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions (Column 9-12) */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

                        {/* Auction Actions Card */}
                        <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-aq-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-xl font-display font-bold mb-6">Auction Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-slate-400 text-sm">EMD Submission</span>
                                    <span className="font-bold text-sm">Online / Draft</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-slate-400 text-sm">Auction Type</span>
                                    <span className="font-bold text-sm uppercase tracking-wider">E-Auction</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-slate-400 text-sm">Property Status</span>
                                    <span className="font-bold text-sm text-aq-gold">Pre-Auction</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <a
                                    href={auction.noticeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center w-full py-4 bg-aq-gold text-white font-bold rounded-xl hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-600/20"
                                >
                                    <Download className="w-5 h-5 mr-2" /> Download Notice
                                </a>
                                <button className="flex items-center justify-center w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10">
                                    <Share2 className="w-5 h-5 mr-2" /> Share Property
                                </button>
                            </div>
                        </div>

                        {/* Help / CTA Box */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                <PhoneCall className="w-6 h-6 text-aq-blue" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Interested in bidding?</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Get expert legal assistance and loan support for this specific property auction.
                            </p>
                            <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-aq-blue transition-all">
                                Get Expert Assistance
                            </button>
                        </div>

                        {/* Save Property */}
                        <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-slate-200 text-slate-500 font-bold rounded-3xl hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all">
                            <Heart className="w-5 h-5" /> Save to Interest List
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuctionDetails;
