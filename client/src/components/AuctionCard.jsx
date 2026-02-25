import React from 'react';
import { Calendar, MapPin, Building2, IndianRupee, ArrowUpRight, Home, Briefcase, Warehouse, Castle, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';

const getPropertyStyle = (type) => {
    switch (type) {
        case 'Residential': return { gradient: 'from-emerald-500 to-teal-600', icon: Home, badge: 'bg-emerald-500', tag: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
        case 'Commercial': return { gradient: 'from-blue-500 to-indigo-600', icon: Briefcase, badge: 'bg-blue-500', tag: 'text-blue-700 bg-blue-50 border-blue-100' };
        case 'Industrial': return { gradient: 'from-slate-500 to-slate-700', icon: Warehouse, badge: 'bg-slate-500', tag: 'text-slate-700 bg-slate-50 border-slate-200' };
        case 'Land': return { gradient: 'from-amber-500 to-orange-600', icon: Castle, badge: 'bg-amber-500', tag: 'text-amber-700 bg-amber-50 border-amber-100' };
        default: return { gradient: 'from-violet-500 to-purple-600', icon: Building2, badge: 'bg-violet-500', tag: 'text-violet-700 bg-violet-50 border-violet-100' };
    }
};

const formatPrice = (num) =>
    new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 2 }).format(num);

const AuctionCard = ({ auction, viewMode = 'grid' }) => {
    const style = getPropertyStyle(auction.propertyType);
    const TypeIcon = style.icon;
    const dateStr = new Date(auction.auctionDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    /* ─── LIST VIEW ─── */
    if (viewMode === 'list') {
        const isImage = auction.noticeUrl && auction.noticeUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i);
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiHost = isLocal ? 'http://localhost:8083' : 'https://madrasauction.com/api';
        const imageUrl = isImage ? (auction.noticeUrl.startsWith('http') ? auction.noticeUrl : `${apiHost}${auction.noticeUrl}`) : null;

        return (
            <div className="flex flex-col sm:flex-row gap-6 py-6 px-6 border-b border-slate-100 bg-white hover:bg-slate-50/50 transition-all duration-300">
                {/* Image Section - Only shown if uploaded */}
                {isImage && (
                    <div className="w-full sm:w-[260px] h-[160px] flex-shrink-0 relative group">
                        <img
                            src={imageUrl}
                            alt={auction.title}
                            className="w-full h-full object-cover rounded-md shadow-sm border border-slate-200"
                        />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1 rounded border border-slate-200">
                            <div className="w-4 h-4 rounded-sm bg-brand-blue/10 flex items-center justify-center">
                                <Building2 className="w-2.5 h-2.5 text-brand-blue" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Section */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-6">
                    {/* Property Details */}
                    <div className="flex-1">
                        <Link to={`/auctions/${auction.id}`}>
                            <h3 className="text-[19px] font-semibold text-[#4e71c4] hover:text-[#3b5998] transition-colors mb-2 tracking-tight leading-tight">
                                {auction.title}
                            </h3>
                        </Link>

                        {/* Project / Locality Badge */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {auction.locality && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                    <MapPin className="w-3 h-3 text-brand-blue/60" />
                                    {auction.locality}
                                </span>
                            )}
                        </div>

                        {/* Bank Display */}
                        <div className="flex items-center gap-2 text-[14px] text-slate-600 mb-4 font-medium">
                            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <span className="text-slate-700 tracking-tight">{auction.bankName}</span>
                        </div>

                        {/* Schedule & Area Row */}
                        <div className="flex items-center gap-4 text-[13px] text-slate-500 mb-2">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                {dateStr}
                            </span>
                            <span className="text-slate-300 font-light">|</span>
                            <span className="font-medium text-slate-600">{auction.area || 'N/A'}</span>
                        </div>

                        {/* Secondary status row (Possession) */}
                        <div className="flex items-center gap-2 text-[13px] text-slate-500">
                            <span className="text-slate-300 font-light">|</span>
                            <span className="font-semibold text-slate-600">
                                {auction.possession ? (auction.possession.includes('Possession') ? auction.possession : `${auction.possession} Possession`) : 'Contact for Possession'}
                            </span>
                        </div>
                    </div>

                    {/* Price & Action Section */}
                    <div className="flex flex-col items-start sm:items-end justify-between sm:w-52 shrink-0 py-1">
                        <div className="text-2xl font-black text-[#158944] tracking-tight">
                            ₹{new Intl.NumberFormat('en-IN').format(auction.reservePrice)}
                        </div>

                        <Link
                            to={`/auctions/${auction.id}`}
                            className="w-full sm:w-auto px-6 py-2.5 border-2 border-[#4571c3] text-[#4571c3] text-[11px] font-black uppercase tracking-widest rounded-md hover:bg-[#4571c3] hover:text-white transition-all duration-300 shadow-sm"
                        >
                            VIEW AUCTION
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ─── GRID VIEW ─── */
    return (
        <div className="group flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-brand-blue/20 hover:shadow-2xl hover:shadow-brand-blue/8 transition-all duration-300 overflow-hidden h-full">

            {/* Gradient Header */}
            <div className={`h-32 bg-gradient-to-br ${style.gradient} relative overflow-hidden flex-shrink-0`}>
                {/* Watermark Icon */}
                <TypeIcon className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
                {/* Gavel watermark */}
                <Gavel className="absolute top-3 right-3 w-5 h-5 text-white/20" />

                {/* Type badge */}
                <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${style.tag}`}>
                    {auction.propertyType}
                </span>

                {/* Date pill */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                    <Calendar className="w-2.5 h-2.5" />
                    {dateStr}
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col p-4">
                {/* Bank + City */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                    <span className="flex items-center gap-1 truncate mr-2">
                        <Building2 className="w-3 h-3 flex-shrink-0 text-slate-300" />
                        <span className="truncate">{auction.bankName}</span>
                    </span>
                    <span className="flex items-center gap-0.5 flex-shrink-0">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        {auction.cityName}
                    </span>
                </div>

                {/* Title */}
                <Link to={`/auctions/${auction.id}`} className="flex-1 mb-3">
                    <h3 className="text-sm font-black text-brand-dark line-clamp-2 leading-snug group-hover:text-brand-blue transition-colors uppercase tracking-tight">
                        {auction.title}
                    </h3>
                </Link>

                {/* Divider */}
                <div className="w-full h-px bg-slate-50 mb-3" />

                {/* Price row */}
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Reserve Price</p>
                        <div className="flex items-center gap-0.5 text-brand-dark font-black text-base">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {formatPrice(auction.reservePrice)}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">EMD</p>
                        <div className="flex items-center gap-0.5 text-slate-500 font-bold text-sm">
                            <IndianRupee className="w-3 h-3" />
                            {formatPrice(auction.emdAmount)}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    to={`/auctions/${auction.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 text-brand-dark font-black text-[10px] uppercase tracking-widest hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-all duration-300 group-hover:shadow-md"
                >
                    View Details <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
};

export default AuctionCard;
