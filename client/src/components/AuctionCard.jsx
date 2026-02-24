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
        return (
            <div className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-100 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300 overflow-hidden">
                {/* Color Strip */}
                <div className={`w-full sm:w-2 flex-shrink-0 bg-gradient-to-b ${style.gradient} min-h-[6px]`} />

                {/* Icon column */}
                <div className={`hidden sm:flex w-20 flex-shrink-0 bg-gradient-to-br ${style.gradient} items-center justify-center`}>
                    <TypeIcon className="w-8 h-8 text-white/80" />
                </div>

                <div className="flex-1 flex flex-col sm:flex-row gap-4 p-5 items-start sm:items-center">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${style.tag}`}>
                                {auction.propertyType}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                <Calendar className="w-3 h-3" /> {dateStr}
                            </span>
                        </div>
                        <Link to={`/auctions/${auction.id}`}>
                            <h3 className="text-base font-black text-brand-dark leading-snug line-clamp-1 group-hover:text-brand-blue transition-colors mb-1 uppercase tracking-tight">
                                {auction.title}
                            </h3>
                        </Link>
                        <div className="flex flex-wrap gap-4 text-[12px] font-semibold text-slate-500">
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-300" />{auction.bankName}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-300" />{auction.cityName}</span>
                        </div>
                    </div>

                    {/* Prices */}
                    <div className="flex sm:flex-col gap-6 sm:gap-2 items-center sm:items-end sm:text-right shrink-0">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Reserve Price</p>
                            <div className="flex items-center gap-0.5 text-brand-dark font-black text-lg">
                                <IndianRupee className="w-4 h-4" />
                                {formatPrice(auction.reservePrice)}
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">EMD</p>
                            <div className="flex items-center gap-0.5 text-slate-600 font-bold text-sm">
                                <IndianRupee className="w-3 h-3" />
                                {formatPrice(auction.emdAmount)}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link
                        to={`/auctions/${auction.id}`}
                        className="flex items-center gap-2 px-5 py-3 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-blue transition-all duration-300 group-hover:shadow-lg shrink-0"
                    >
                        View <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
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
