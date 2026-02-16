import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    MapPin, Building2, Calendar, IndianRupee, FileText, ArrowLeft,
    Share2, ShieldCheck, Download, Phone, Mail, Printer,
    ExternalLink, ChevronRight, Ruler, Compass, Home, Layers,
    Clock, AlertTriangle, FileCheck, Lock, Sparkles
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const AuctionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/auctions/${id}`)
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
    );

    if (!auction) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Property Not Found</h2>
            <Link to="/auctions" className="text-blue-600 hover:underline">Return to Auctions</Link>
        </div>
    );

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="bg-[#f8f9fa] min-h-screen font-sans text-slate-800">
            {/* Navigation Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/auctions" className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <nav className="hidden sm:flex items-center text-sm font-medium text-slate-500">
                            <Link to="/" className="hover:text-slate-900">Home</Link>
                            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
                            <Link to="/auctions" className="hover:text-slate-900">Auctions</Link>
                            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
                            <span className="text-slate-900 truncate max-w-[200px]">Property #{auction.id}</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                            <Printer className="w-4 h-4" /> Print
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Title Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="space-y-3 max-w-4xl">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold rounded uppercase tracking-wide">
                                    {auction.propertyType}
                                </span>
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold rounded uppercase tracking-wide flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Verfied Notice
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                                {auction.title}
                            </h1>
                            <div className="flex items-center text-slate-500 text-sm">
                                <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                                {auction.cityName}, India
                                <span className="mx-2 text-slate-300">|</span>
                                <Building2 className="w-4 h-4 mr-1.5 text-slate-400" />
                                {auction.bankName}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-sm font-medium text-slate-500 mb-1">Reserve Price</p>
                            <p className="text-3xl font-bold text-slate-900">{formatCurrency(auction.reservePrice)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Placeholder */}
                        <div className="aspect-video bg-slate-100 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden group shadow-sm">
                            <Building2 className="w-16 h-16 text-slate-300" />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1.5 rounded shadow-sm">Preview only</span>
                            </div>
                        </div>

                        {/* Property Specifications Grid */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Home className="w-4 h-4 text-slate-500" /> Property Specifications
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                                    <div>
                                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            <Ruler className="w-3 h-3 mr-1" /> Area
                                        </span>
                                        <span className="text-sm font-medium text-slate-900 block">{auction.area}</span>
                                    </div>
                                    <div>
                                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            <Compass className="w-3 h-3 mr-1" /> Facing
                                        </span>
                                        <span className="text-sm font-medium text-slate-900 block">{auction.facing}</span>
                                    </div>
                                    <div>
                                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            <Layers className="w-3 h-3 mr-1" /> Ownership
                                        </span>
                                        <span className="text-sm font-medium text-slate-900 block">{auction.type}</span>
                                    </div>
                                    <div>
                                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            <ShieldCheck className="w-3 h-3 mr-1" /> Possession
                                        </span>
                                        <span className="text-sm font-medium text-slate-900 block">{auction.possession}</span>
                                    </div>
                                    <div>
                                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            <Building2 className="w-3 h-3 mr-1" /> Type
                                        </span>
                                        <span className="text-sm font-medium text-slate-900 block">{auction.propertyType}</span>
                                    </div>
                                    <div>
                                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            <MapPin className="w-3 h-3 mr-1" /> City
                                        </span>
                                        <span className="text-sm font-medium text-slate-900 block">{auction.cityName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Auction Details Grid */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-500" /> Auction Schedule & Rules
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span className="text-sm text-slate-500">Auction Date</span>
                                        <span className="text-sm font-bold text-slate-900">{formatDate(auction.auctionDate)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span className="text-sm text-slate-500">Inspection Date (Tentative)</span>
                                        <span className={`text-sm font-medium text-slate-900 ${!user?.isPremium && 'blur-sm select-none'}`}>{formatDate(auction.inspectionDate)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span className="text-sm text-slate-500">EMD Amount</span>
                                        <span className="text-sm font-bold text-slate-900">{formatCurrency(auction.emdAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span className="text-sm text-slate-500">Last Date for EMD</span>
                                        <span className={`text-sm font-medium text-slate-900 font-mono ${!user?.isPremium && 'blur-sm select-none'}`}>{formatDate(auction.emdLastDate)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span className="text-sm text-slate-500">Reserve Price</span>
                                        <span className="text-sm font-bold text-slate-900">{formatCurrency(auction.reservePrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span className="text-sm text-slate-500">Bid Multiplier</span>
                                        <span className={`text-sm font-medium text-slate-900 ${!user?.isPremium && 'blur-sm select-none'}`}>{formatCurrency(auction.bidIncrement)}</span>
                                    </div>
                                </div>
                                <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-100 flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-800 uppercase mb-1">Important Notice</p>
                                        <p className="text-xs text-amber-900 leading-relaxed">
                                            The sale shall be subject to the conditions prescribed in the Security Interest (Enforcement) Rules 2002. Detailed terms and conditions are available in the official tender document.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-500" /> Full Description
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                                    <p>
                                        {auction.description || "The authorized officer of the bank has taken possession of the schedule property under the SARFAESI Act.\n\n This prime property is now available for auction. We recommend interested buyers to physically inspect the property before participating in the bidding process. The property is being sold on an 'As is where is', 'As is what is', and 'Whatever there is' basis.\n\nOutstanding dues if any, such as electricity, water, and property tax must be verified by the bidder."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">

                        {/* Action Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24 overflow-hidden group">

                            {!user?.isPremium && (
                                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-aq-gold/10 rounded-full flex items-center justify-center mx-auto">
                                            <Lock className="w-8 h-8 text-aq-gold" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Premium Content</h3>
                                        <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                                            Official notice downloads and contact details are available for premium members only.
                                        </p>
                                        <Link
                                            to="/plans"
                                            className="inline-flex items-center gap-2 bg-aq-gold hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-aq-gold/20 transition-all transform hover:-translate-y-1"
                                        >
                                            <Sparkles className="w-4 h-4" /> Upgrade Now
                                        </Link>
                                    </div>
                                </div>
                            )}

                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Official Actions</h3>
                                <div className="space-y-3">
                                    <a
                                        href={auction.noticeUrl || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex w-full items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-lg font-semibold text-sm transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Download Notice
                                    </a>
                                    <button className="flex w-full items-center justify-center gap-2 bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 px-4 py-3 rounded-lg font-semibold text-sm transition-all">
                                        <ExternalLink className="w-4 h-4" /> E-Auction Portal
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Officer</h3>
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                        {auction.contactOfficer ? auction.contactOfficer.split(' ').slice(0, 2).map(n => n[0]).join('') : 'BK'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{auction.contactOfficer}</p>
                                        <p className="text-xs text-slate-500">Authorized Officer</p>
                                    </div>
                                </div>
                                <button className="w-full flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all">
                                    <Phone className="w-4 h-4" /> View Phone Number
                                </button>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Documents Available</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> Sale Notice
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> Tender Document
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <FileCheck className="w-3.5 h-3.5 text-slate-300" /> Title Deed (On Request)
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <FileCheck className="w-3.5 h-3.5 text-slate-300" /> Encumbrance Cert (On Request)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AuctionDetails;
