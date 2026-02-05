import React from 'react';
import { Calendar, MapPin, Building2, IndianRupee, ArrowUpRight, Home, Briefcase, Warehouse, Castle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuctionCard = ({ auction }) => {
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

    return (
        <div className="group flex flex-col bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 overflow-hidden h-full relative hover:-translate-y-1">

            {/* Visual Header / Image Placeholder */}
            <div className={`h-32 bg-gradient-to-br ${style.gradient} relative overflow-hidden`}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                {/* Type Icon Watermark */}
                <TypeIcon className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-20 transform rotate-12" />

                {/* Badge */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md text-slate-800 shadow-sm">
                    {auction.propertyType}
                </span>

                {/* Date Badge */}
                <div className="absolute bottom-3 right-4 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center border border-white/20">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {new Date(auction.auctionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            <div className="flex-1 p-5 flex flex-col">
                <div className="flex-1">
                    {/* Bank & Location Row */}
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-3">
                        <div className="flex items-center bg-slate-50 px-2 py-1 rounded-md">
                            <Building2 className="w-3 h-3 mr-1.5 text-slate-400" />
                            <span className="truncate max-w-[120px]">{auction.bankName}</span>
                        </div>
                        <div className="flex items-center text-slate-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{auction.cityName}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <Link to={`/auctions/${auction.id}`} className="block">
                        <h3 className="text-lg font-display font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-aq-blue transition-colors mb-4 min-h-[3.5rem]">
                            {auction.title}
                        </h3>
                    </Link>

                    {/* Price Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className={`rounded-xl p-3 ${style.bg} border border-white`}>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reserve Price</p>
                            <div className={`flex items-center font-bold text-lg ${style.color}`}>
                                <IndianRupee className="w-4 h-4" />
                                {new Intl.NumberFormat('en-IN', { notation: "compact", maximumFractionDigits: 1 }).format(auction.reservePrice)}
                            </div>
                        </div>
                        <div className="rounded-xl p-3 bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">EMD</p>
                            <p className="text-sm font-bold text-slate-600">
                                {new Intl.NumberFormat('en-IN', { notation: "compact", maximumFractionDigits: 1 }).format(auction.emdAmount)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    to={`/auctions/${auction.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-sm group-hover/btn"
                >
                    View Details <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            </div>
        </div>
    );
};

export default AuctionCard;
