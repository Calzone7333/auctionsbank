import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    MapPin, Building2, Calendar, IndianRupee, FileText, ArrowLeft,
    Share2, ShieldCheck, Download, Phone, Mail, Printer,
    ExternalLink, ChevronRight, Ruler, Compass, Home, Layers,
    Clock, AlertTriangle, FileCheck, Lock, Sparkles
} from 'lucide-react';
import { API_BASE_URL, getFileUrl } from '../apiConfig';

const AuctionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [auction, setAuction] = useState(null);
    const [similarAuctions, setSimilarAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/auctions/${id}`)
            .then(res => res.json())
            .then(data => {
                setAuction(data);
                // After fetching main auction, fetch similar ones
                fetch(`${API_BASE_URL}/auctions`)
                    .then(res => res.json())
                    .then(allAuctions => {
                        const similar = allAuctions
                            .filter(a => a.id !== data.id && (a.cityName === data.cityName || a.propertyType === data.propertyType))
                            .slice(0, 5);
                        setSimilarAuctions(similar);
                    });
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching auction details:", err);
                setLoading(false);
            });
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: auction?.title,
                text: `Check out this auction property: ${auction?.title}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const getCalendarLink = () => {
        if (!auction) return '#';
        const start = new Date(auction.auctionDate).toISOString().replace(/-|:|\.\d+/g, '');
        const end = new Date(auction.auctionEndDate || auction.auctionDate).toISOString().replace(/-|:|\.\d+/g, '');
        const details = `Property Auction: ${auction.title}\nBank: ${auction.bankName}\nReserve Price: ${auction.reservePrice}`;
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(auction.title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(auction.cityName)}&sf=true&output=xml`;
    };

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

    const formatDate = (dateString) => {
        if (!dateString) return 'NA';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? 'NA' : d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-[11px] text-slate-400 mb-4 font-bold uppercase tracking-wider">
                    <Link to="/" className="hover:text-brand-blue">Home</Link>
                    <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
                    <Link to={`/auctions?city=${encodeURIComponent(auction.cityName)}`} className="hover:text-brand-blue">{auction.cityName}</Link>
                    <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
                    <span className="text-slate-500">{auction.bankName}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left & Center Column: Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Title & Price Header */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="space-y-1">
                                <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                                    {auction.title || `Property in ${auction.locality}, ${auction.cityName}`}
                                </h1>
                                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                                    <div className="p-1 bg-brand-blue/10 rounded">
                                        <Building2 className="w-4 h-4 text-brand-blue" />
                                    </div>
                                    <span className="text-brand-blue">{auction.bankName}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-3">
                                    <p className="text-2xl font-black text-emerald-600 tracking-tighter">{formatCurrency(auction.reservePrice)}</p>
                                    <button
                                        onClick={handleShare}
                                        className="p-2.5 text-slate-400 hover:text-brand-blue hover:bg-slate-50 rounded-full transition-all"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image Section - Only shown if an image is actually uploaded */}
                        {(auction.imageUrl || (auction.noticeUrl && auction.noticeUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i))) && (
                            <div className="space-y-4">
                                <div className="relative rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                                        <span className="px-3 py-1 bg-white/90 text-red-600 text-[13px] font-bold italic shadow-sm rounded-sm uppercase tracking-widest">Property Preview</span>
                                    </div>
                                    <img
                                        src={auction.imageUrl ? getFileUrl(auction.imageUrl) : getFileUrl(auction.noticeUrl)}
                                        alt="Property View"
                                        className="w-full aspect-[16/7] object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="border-b border-slate-200">
                            <div className="flex gap-8">
                                <button className="pb-3 text-sm font-bold text-brand-dark border-b-2 border-brand-dark">Description</button>
                                <button className="pb-3 text-sm font-medium text-slate-400 hover:text-slate-600">Auction History</button>
                            </div>
                        </div>

                        {/* Details Grid - Matching Screenshot style */}
                        <div className="space-y-4 pt-2">
                            {[
                                { label: 'Borrower Name', value: auction.borrowerName },
                                { label: 'Bank Name', value: auction.bankName, isLink: true },
                                { label: 'Property Type', value: auction.propertyType },
                                { label: 'Description', value: auction.description || `Individual House for Sale in ${auction.cityName}` },
                                { label: 'Location', value: auction.location },
                                { label: 'Area', value: auction.area },
                                { label: 'Possession', value: auction.possession },
                                { label: 'Locality', value: auction.locality },
                                { label: 'City', value: auction.cityName },
                                { label: 'Reserve Price', value: formatCurrency(auction.reservePrice), isBold: true },
                                { label: 'Emd Amount', value: formatCurrency(auction.emdAmount) },
                                { label: 'Bid Increment', value: formatCurrency(auction.bidIncrement) },
                                { label: 'EMD submission', value: formatDate(auction.emdLastDate) },
                                { label: 'Auction Start Date & Time', value: formatDate(auction.auctionDate), subValue: 'Add To Calendar' },
                                { label: 'Auction End Date & Time', value: formatDate(auction.auctionEndDate) },
                                { label: 'Bank Contact Details', value: auction.bankContactDetails },
                            ].map((item, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1 min-h-[32px] items-start">
                                    <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-tight">{item.label}</span>
                                    <div className="md:col-span-2 space-y-1">
                                        <p className={`text-[13px] ${item.isLink ? 'text-blue-500 font-bold hover:underline cursor-pointer' : 'text-slate-600'} ${item.isBold ? 'font-bold' : ''}`}>
                                            {item.value || 'N/A'}
                                        </p>
                                        {item.subValue && (
                                            <a
                                                href={getCalendarLink()}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-blue-500 font-bold hover:underline block mt-1"
                                            >
                                                {item.subValue}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Auction File */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 items-start">
                                <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-tight">Download Auction File</span>
                                <div className="md:col-span-2">
                                    {auction.noticeUrl ? (
                                        <a
                                            href={getFileUrl(auction.noticeUrl)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex flex-col items-center w-fit group"
                                        >
                                            <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                                <FileText className="w-8 h-8 text-red-500" />
                                            </div>
                                            <span className="text-[10px] text-blue-500 mt-2 text-center max-w-[80px] leading-tight">
                                                {auction.title || 'Auction Notice'}.pdf
                                            </span>
                                        </a>
                                    ) : (
                                        <span className="text-[13px] text-slate-400 italic">No file available</span>
                                    )}
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 border-t border-slate-100">
                                <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-tight">Feedback</span>
                                <button className="text-[11px] text-blue-500 hover:underline text-left">Report inaccuracy</button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Share Card */}
                        <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-brand-dark text-white px-4 py-2">
                                <h3 className="text-sm font-bold uppercase">Share</h3>
                            </div>
                            <div className="p-4 flex gap-3">
                                <a href={`tel:${auction.bankContactDetails}`} className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors"><Phone className="w-4 h-4" /></a>
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(auction.location + ' ' + auction.cityName)}`} target="_blank" rel="noreferrer" className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors"><MapPin className="w-4 h-4" /></a>
                                <a href={`mailto:?subject=${encodeURIComponent('Auction Property: ' + auction.title)}&body=${encodeURIComponent('Check this out: ' + window.location.href)}`} className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors"><Mail className="w-4 h-4" /></a>
                                <button onClick={handleShare} className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors"><Share2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Similar Auctions */}
                        <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-brand-dark text-white px-4 py-2">
                                <h3 className="text-sm font-bold uppercase tracking-tight">Similar Auction Properties</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {similarAuctions.length > 0 ? similarAuctions.map((sim, i) => (
                                    <Link key={sim.id} to={`/auctions/${sim.id}`} className="p-4 block space-y-1 hover:bg-slate-50 transition-colors group">
                                        <h4 className="text-[12px] font-bold text-blue-500 line-clamp-2 leading-snug group-hover:underline">
                                            {sim.title}
                                        </h4>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                            <Building2 className="w-3 h-3" />
                                            <span>{sim.bankName}</span>
                                        </div>
                                        <p className="text-[12px] font-extrabold text-emerald-600">{formatCurrency(sim.reservePrice)}</p>
                                    </Link>
                                )) : (
                                    <p className="p-4 text-[12px] text-slate-400 italic">No similar properties found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AuctionDetails;
