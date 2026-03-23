import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    MapPin, Building2, Calendar, IndianRupee, FileText, ArrowLeft,
    Share2, ShieldCheck, Download, Phone, Mail, Printer,
    ExternalLink, ChevronRight, Ruler, Compass, Home, Layers,
    Clock, AlertTriangle, Lock, Sparkles
} from 'lucide-react';
import { API_BASE_URL, getFileUrl } from '../apiConfig';

const AuctionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [auction, setAuction] = useState(null);
    const [similarAuctions, setSimilarAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const isPremiumValid = () => {
        if (!user) return false;
        if (user.role === 'ADMIN') return true;
        if (user.accountType !== 'PREMIUM') return false;
        if (!user.planExpiryDate) return false;

        const expiry = new Date(user.planExpiryDate);
        return expiry > new Date();
    };

    useEffect(() => {
        setLoading(true);
        const headers = {};
        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        } else {
            const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    if (userData.token) headers['Authorization'] = `Bearer ${userData.token}`;
                } catch(e) {}
            }
        }

        fetch(`${API_BASE_URL}/auctions/${id}`, { headers })
            .then(res => {
                if (res.status === 401) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => {
                console.log("DEBUG: RECEIVED AUCTION DATA FROM BACKEND:", data); // THIS PRINTS TO BROWSER CONSOLE
                setAuction(data);
                // After fetching main auction, fetch similar ones
                fetch(`${API_BASE_URL}/auctions`, { headers })
                    .then(res => res.json())
                    .then(allAuctions => {
                        const similar = Array.isArray(allAuctions) ? allAuctions
                            .filter(a => a.id !== data.id && (a.cityName === data.cityName || a.propertyType === data.propertyType))
                            .slice(0, 5) : [];
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

                        {/* Image Gallery Section */}
                        {((auction.imageUrls && auction.imageUrls.length > 0) || (auction.imageUrl && !imageError)) && (
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group">
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 bg-white/90 text-brand-blue text-[10px] font-black shadow-sm rounded-full uppercase tracking-[0.2em] border border-blue-100">Property Preview</span>
                                    </div>
                                    <img
                                        src={getFileUrl(auction.imageUrl || (auction.imageUrls && auction.imageUrls[0]))}
                                        alt="Property Main View"
                                        className="w-full aspect-[21/9] object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={() => setImageError(true)}
                                    />
                                </div>

                                {/* Thumbnails / Gallery */}
                                {auction.imageUrls && auction.imageUrls.length > 1 && (
                                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                                        {auction.imageUrls.map((url, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => setAuction(prev => ({ ...prev, imageUrl: url }))}
                                                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${auction.imageUrl === url ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-transparent hover:border-slate-200'}`}
                                            >
                                                <img src={getFileUrl(url)} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section Header */}
                        <div className="border-b border-slate-200">
                            <div className="flex gap-8">
                                <h2 className="pb-3 text-sm font-bold text-brand-dark border-b-2 border-brand-dark uppercase tracking-wider">Property Information</h2>
                            </div>
                        </div>

                        {/* Details Grid - Matching Screenshot style */}
                        <div className="space-y-4 pt-2">
                            {[
                                { label: 'Borrower Name', value: auction.borrowerName, isPremium: true },
                                { label: 'Bank Name', value: auction.bankName, isLink: true },
                                { label: 'Property Type', value: auction.propertyType },
                                { label: 'Description', value: auction.description || `Individual House for Sale in ${auction.cityName}` },
                                { label: 'Location', value: auction.location, isPremium: true },
                                { label: 'Area', value: auction.area },
                                { label: 'Possession', value: auction.possession },
                                { label: 'Locality', value: auction.locality, isPremium: true },
                                { label: 'City', value: auction.cityName },
                                { label: 'Reserve Price', value: formatCurrency(auction.reservePrice), isBold: true },
                                { label: 'Emd Amount', value: formatCurrency(auction.emdAmount) },
                                { label: 'Bid Increment', value: formatCurrency(auction.bidIncrement) },
                                { label: 'EMD submission', value: formatDate(auction.emdLastDate) },
                                { label: 'Auction Start Date & Time', value: formatDate(auction.auctionDate), subValue: 'Add To Calendar' },
                                { label: 'Auction End Date & Time', value: formatDate(auction.auctionEndDate) },
                                { label: 'Bank Contact Details', value: auction.bankContactDetails, isPremium: true },
                            ].map((item, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1 min-h-[32px] items-start relative overflow-hidden">
                                    <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-tight">{item.label}</span>
                                    <div className={`md:col-span-2 space-y-1 relative ${item.isPremium && !isPremiumValid() ? 'select-none' : ''}`}>
                                        {item.isPremium && !isPremiumValid() ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13px] text-slate-400 blur-[5px] cursor-not-allowed">
                                                    **********************
                                                </span>
                                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter ring-1 ring-slate-200">Premium Only</span>
                                            </div>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Auction File */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 items-start">
                                <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-tight">Download Auction Files</span>
                                <div className="md:col-span-2">
                                    {!isPremiumValid() ? (
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-3 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                                                <Lock className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] text-slate-400 blur-[4px] select-none">auction_document_locked.pdf</span>
                                                <Link to="/plans" className="text-[10px] text-brand-blue font-black uppercase tracking-widest mt-1 py-1 hover:underline">Subscribe to Unlock Documents</Link>
                                            </div>
                                        </div>
                                    ) : (auction.noticeUrls && auction.noticeUrls.length > 0) ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {auction.noticeUrls.map((url, idx) => (
                                                <a
                                                    key={idx}
                                                    href={getFileUrl(url)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-brand-blue hover:shadow-md transition-all group"
                                                >
                                                    <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-bold text-slate-700 truncate uppercase tracking-tight">Doc {idx + 1}</p>
                                                        <p className="text-[9px] text-slate-400 font-medium">Click to View</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    ) : auction.noticeUrl ? (
                                        <a
                                            href={getFileUrl(auction.noticeUrl)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-4 group"
                                        >
                                            <div className="p-4 bg-red-50 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-slate-700 truncate group-hover:text-brand-blue transition-colors uppercase tracking-tight">
                                                    {auction.title || 'Auction Notice'}.pdf
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Primary Document • View Now</span>
                                            </div>
                                        </a>
                                    ) : (
                                        <span className="text-[13px] text-slate-400 italic">No files available for this property</span>
                                    )}
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 border-t border-slate-100">
                                <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-tight">Feedback</span>
                                <button className="text-[11px] text-blue-500 hover:underline text-left">Report inaccuracy</button>
                            </div>
                        </div>

                        {/* Premium Protection Banner - Moved to Bottom */}
                        {!isPremiumValid() && (
                            <div className="relative group overflow-hidden mt-12">
                                {/* Blurred Background Overlay for following content */}
                                <div className="bg-brand-blue rounded-3xl p-8 md:p-12 text-center relative z-10 shadow-2xl shadow-brand-blue/30 overflow-hidden">
                                    {/* Decorative background elements */}
                                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-brand-dark/20 rounded-full blur-3xl"></div>

                                    <div className="relative z-20 space-y-6">
                                        <div className="flex justify-center flex-col items-center gap-4">
                                            <div className="relative">
                                                <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                                                <div className="bg-white p-5 rounded-full shadow-xl relative">
                                                    <Sparkles className="w-10 h-10 text-brand-blue animate-bounce" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="h-px w-8 md:w-16 bg-white/30"></div>
                                                <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">Become Premium Member</h2>
                                                <div className="h-px w-8 md:w-16 bg-white/30"></div>
                                            </div>
                                        </div>

                                        <p className="text-white/90 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                            To view complete address, auction notice & authorize person contact details
                                        </p>

                                        <div className="pt-4 flex flex-col items-center gap-4">
                                            <Link
                                                to="/plans"
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-900/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                                            >
                                                Get Premium for ₹999
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">Unlock Instant Access • 1 Month Validity</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
