import React from 'react';
import { Calendar, MapPin, Building2, IndianRupee, ArrowUpRight, Home, Briefcase, Warehouse, Castle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuctionCard = ({ auction, viewMode = 'grid' }) => {
    // Helper to determine visual style based on property type
    const getPropertyStyle = (type) => {
        switch (type) {
            case 'Residential':
                return {
                    gradient: 'from-emerald-400 to-teal-500',
                    icon: Home,
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50'
                };
            case 'Commercial':
                return {
                    gradient: 'from-blue-400 to-indigo-500',
                    icon: Briefcase,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50'
                };
            case 'Industrial':
                return {
                    gradient: 'from-slate-400 to-slate-600',
                    icon: Warehouse,
                    color: 'text-slate-600',
                    bg: 'bg-slate-50'
                };
            case 'Land':
                return {
                    gradient: 'from-amber-400 to-orange-500',
                    icon: Castle,
                    color: 'text-amber-600',
                    bg: 'bg-amber-50'
                };
            default:
                return {
                    gradient: 'from-indigo-400 to-purple-500',
                    icon: Building2,
                    color: 'text-indigo-600',
                    bg: 'bg-indigo-50'
                };
        }
    };

    const style = getPropertyStyle(auction.propertyType);
    const TypeIcon = style.icon;
    const dateStr = new Date(auction.auctionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    if (viewMode === 'list') {
        return (
            <div className="group flex flex-col md:flex-row bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 overflow-hidden h-full relative hover:-translate-y-0.5">
                {/* Visual Header / Image Placeholder - Extremely Compact */}
                <div className={`h-32 md:h-auto md:w-40 bg-gradient-to-br ${style.gradient} relative overflow-hidden flex-shrink-0`}>
                    <TypeIcon className="absolute -bottom-4 -right-4 w-20 h-20 text-white opacity-10 transform rotate-12" />
                    <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full text-slate-800 shadow-sm border border-white/20">
                        {auction.propertyType}
                    </span>
                </div>

                {/* Highly Compact Content */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center text-slate-600">
                                    <Building2 className="w-3 h-3 mr-1 text-slate-400" />
                                    <span className="truncate max-w-[120px]">{auction.bankName}</span>
                                </div>
                                <div className="flex items-center text-slate-400">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    <span>{auction.cityName}</span>
                                </div>
                            </div>
                            <div className="md:hidden flex items-center bg-slate-50 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                <Calendar className="w-2.5 h-2.5 mr-1" /> {dateStr}
                            </div>
                        </div>

                        <div className="flex justify-between items-start gap-3">
                            <Link to={`/auctions/${auction.id}`} className="block group-hover:text-amber-600 transition-colors">
                                <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">
                                    {auction.title}
                                </h3>
                            </Link>
                            <div className="hidden md:flex flex-col items-end shrink-0">
                                <div className="flex items-center text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                                    <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                                    {dateStr}
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1 mb-3 max-w-2xl">
                            {auction.description || "View details for more info."}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-3 border-t border-slate-50 pt-2">
                        <div className="flex gap-6 w-full md:w-auto">
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0">Reserve Price</p>
                                <div className="flex items-center font-bold text-base text-slate-900">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-800" />
                                    {new Intl.NumberFormat('en-IN', { notation: "compact", maximumFractionDigits: 1 }).format(auction.reservePrice)}
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0">EMD</p>
                                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                                    {new Intl.NumberFormat('en-IN', { notation: "compact", maximumFractionDigits: 1 }).format(auction.emdAmount)}
                                </p>
                            </div>
                        </div>

                        <Link
                            to={`/auctions/${auction.id}`}
                            className="w-full md:w-auto flex items-center justify-center gap-1.5 py-1.5 px-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all text-xs shadow-sm"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 overflow-hidden h-full relative hover:-translate-y-0.5">

            {/* Visual Header / Image Placeholder - Aggressively Reduced Height */}
            <div className={`h-28 bg-gradient-to-br ${style.gradient} relative overflow-hidden`}>

                {/* Type Icon Watermark */}
                <TypeIcon className="absolute -bottom-5 -right-5 w-20 h-20 text-white opacity-10 transform rotate-12" />

                {/* Badge */}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full text-slate-800 shadow-sm border border-white/20">
                    {auction.propertyType}
                </span>

                {/* Date Badge */}
                <div className="absolute bottom-2 right-3 bg-black/30 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold flex items-center border border-white/10 shadow-sm">
                    <Calendar className="w-2.5 h-2.5 mr-1" />
                    {dateStr}
                </div>
            </div>

            <div className="flex-1 p-3 flex flex-col">
                <div className="flex-1">
                    {/* Bank & Location Row */}
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5 ">
                        <div className="flex items-center text-slate-600 truncate mr-2">
                            <Building2 className="w-3 h-3 mr-1 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{auction.bankName}</span>
                        </div>
                        <div className="flex items-center text-slate-400 flex-shrink-0">
                            <MapPin className="w-3 h-3 mr-0.5" />
                            <span>{auction.cityName}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <Link to={`/auctions/${auction.id}`} className="block group-hover:text-amber-600 transition-colors">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2 min-h-[2.25rem]">
                            {auction.title}
                        </h3>
                    </Link>

                    {/* Divider */}
                    <div className="w-full h-px bg-slate-50 mb-2"></div>

                    {/* Price Info */}
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0">Reserve Price</p>
                            <div className="flex items-center font-bold text-base text-slate-900">
                                <IndianRupee className="w-3.5 h-3.5 text-slate-800" />
                                {new Intl.NumberFormat('en-IN', { notation: "compact", maximumFractionDigits: 1 }).format(auction.reservePrice)}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0">EMD</p>
                            <p className="text-xs font-semibold text-slate-600">
                                {new Intl.NumberFormat('en-IN', { notation: "compact", maximumFractionDigits: 1 }).format(auction.emdAmount)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    to={`/auctions/${auction.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-4 bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-xs"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default AuctionCard;
