import React from 'react';
import { Calendar, MapPin, Building2, IndianRupee, ArrowUpRight, Home, Briefcase, Warehouse, Castle, Gavel, FileText, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFileUrl } from '../apiConfig';

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
    const dateObj = auction.auctionDate ? new Date(auction.auctionDate) : null;
    const dateStr = (dateObj && !isNaN(dateObj.getTime()))
        ? dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'NA';

    const [imageError, setImageError] = React.useState(false);

    // Image logic: Use primary imageUrl OR first in imageUrls array
    const imageUrl = auction.imageUrl 
        ? getFileUrl(auction.imageUrl) 
        : (auction.imageUrls && auction.imageUrls.length > 0)
            ? getFileUrl(auction.imageUrls[0])
            : null;

    const noticeCount = (auction.noticeUrls && auction.noticeUrls.length > 0) 
        ? auction.noticeUrls.length 
        : auction.noticeUrl ? 1 : 0;
    
    const imageCount = (auction.imageUrls && auction.imageUrls.length > 0)
        ? auction.imageUrls.length
        : auction.imageUrl ? 1 : 0;

    /* ─── LIST VIEW ─── */
    if (viewMode === 'list') {
        return (
            <div className="flex flex-col sm:flex-row gap-6 py-6 px-6 border-b border-slate-100 bg-white hover:bg-slate-50/50 transition-all duration-300">
                {/* Image Section */}
                {imageUrl && !imageError && (
                    <div className="w-full sm:w-[260px] h-[160px] flex-shrink-0 relative group">
                        <img
                            src={imageUrl}
                            alt={auction.title}
                            className="w-full h-full object-cover rounded-md shadow-sm border border-slate-200"
                            onError={() => setImageError(true)}
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
                            <h3 className="text-[19px] font-semibold text-[#4e71c4] hover:text-[#3b5998] transition-colors mb-2 tracking-tight leading-tight uppercase">
                                {auction.title}
                            </h3>
                        </Link>

                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-100 uppercase tracking-widest">
                                <MapPin className="w-3 h-3 text-brand-blue" />
                                {auction.locality || auction.cityName}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-100 uppercase tracking-widest">
                                <Building2 className="w-3 h-3 text-brand-blue" />
                                {auction.propertyType}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-3 max-w-md">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Bank Name</p>
                                <p className="text-sm font-bold text-slate-700 truncate">{auction.bankName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Auction Date</p>
                                <p className="text-sm font-bold text-slate-700">{dateStr}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="flex flex-col justify-between items-end min-w-[180px]">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Reserve Price</p>
                            <div className="text-2xl font-black text-[#158944] flex items-center justify-end gap-1">
                                <IndianRupee className="w-5 h-5" />
                                {new Intl.NumberFormat('en-IN').format(auction.reservePrice)}
                            </div>
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

            {/* Header with Image */}
            {imageUrl && !imageError ? (
                <div className="relative h-44 flex-shrink-0 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={auction.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />

                    {/* Overlays */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Type badge */}
                    <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${style.tag}`}>
                        {auction.propertyType}
                    </span>

                    {/* Date pill */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">
                        <Calendar className="w-2.5 h-2.5" />
                        {dateStr}
                    </div>

                    {/* Image count pill */}
                    {imageCount > 1 && (
                        <div className="absolute bottom-3 left-3 bg-brand-dark/60 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest shadow-sm">
                            <ImageIcon className="w-2.5 h-2.5 inline-block mr-1" />
                            {imageCount} Photos
                        </div>
                    )}
                </div>
            ) : (
                <div className="px-5 pt-5">
                    <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${style.tag}`}>
                            {auction.propertyType}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <Calendar className="w-2.5 h-2.5" />
                            {dateStr}
                        </div>
                    </div>
                </div>
            )}

            {/* Body */}
            <div className="flex-1 flex flex-col p-5">
                {/* Bank + City */}
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5 truncate mr-2">
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-brand-blue" />
                        <span className="truncate">{auction.bankName}</span>
                    </span>
                    <span className="flex items-center gap-1 flex-shrink-0">
                        <MapPin className="w-3 h-3 text-brand-blue" />
                        {auction.cityName}
                    </span>
                </div>

                {/* Title */}
                <Link to={`/auctions/${auction.id}`} className="flex-1 mb-4">
                    <h3 className="text-[15px] font-black text-brand-dark line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors uppercase tracking-tight">
                        {auction.title}
                    </h3>
                </Link>

                {/* Pricing row */}
                <div className="flex items-end justify-between mb-5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Reserve Price</p>
                        <div className="flex items-center gap-0.5 text-brand-dark font-black text-lg leading-none">
                            <IndianRupee className="w-4 h-4 text-brand-blue" />
                            {formatPrice(auction.reservePrice)}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">EMD Amt</p>
                        <div className="flex items-center gap-0.5 text-slate-500 font-bold text-sm leading-none">
                            <IndianRupee className="w-3 h-3" />
                            {formatPrice(auction.emdAmount)}
                        </div>
                    </div>
                </div>

                {/* Multiple Notices info */}
                {noticeCount > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex -space-x-1.5 overflow-hidden">
                            {[...Array(Math.min(noticeCount, 3))].map((_, i) => (
                                <div key={i} className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-red-50 flex items-center justify-center">
                                    <FileText className="w-2.5 h-2.5 text-red-500" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#4e71c4]">
                            {noticeCount} Document{noticeCount > 1 ? 's' : ''} Attached
                        </span>
                    </div>
                )}

                {/* CTA */}
                <Link
                    to={`/auctions/${auction.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-dark text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-blue transition-all duration-300 shadow-lg shadow-brand-dark/10 group-hover:shadow-brand-blue/20"
                >
                    View Property <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default AuctionCard;
