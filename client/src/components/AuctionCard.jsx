import React from 'react';
import { Calendar, MapPin, Building2, IndianRupee, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuctionCard = ({ auction }) => {
    return (
        <div className="group flex flex-col bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full relative">

            {/* Header Badge */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm ${auction.propertyType === 'Residential' ? 'bg-green-500 text-white' :
                        auction.propertyType === 'Commercial' ? 'bg-aq-blue text-white' : 'bg-slate-500 text-white'
                    }`}>
                    {auction.propertyType}
                </span>
                <div className="bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm text-aq-gold">
                    <ShieldCheck className="w-4 h-4" />
                </div>
            </div>

            <div className="flex-1 p-7 flex flex-col">
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Ref ID: {auction.id}</p>
                    <h3 className="text-xl font-display font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-aq-blue transition-colors mb-4">
                        {auction.title}
                    </h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm font-medium text-slate-500">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-blue-50 transition-colors">
                                <Building2 className="h-4 w-4 text-aq-blue" />
                            </div>
                            <span className="truncate">{auction.bankName}</span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-slate-500">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-red-50 transition-colors">
                                <MapPin className="h-4 w-4 text-red-400" />
                            </div>
                            <span className="truncate">{auction.cityName}</span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-slate-500">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-orange-50 transition-colors">
                                <Calendar className="h-4 w-4 text-orange-400" />
                            </div>
                            <span className="font-bold text-slate-700">{new Date(auction.auctionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="pt-5 border-t border-slate-50">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reserve Price</p>
                                <div className="flex items-center text-aq-blue">
                                    <IndianRupee className="h-4 w-4 font-bold" />
                                    <span className="text-xl font-display font-bold">
                                        {new Intl.NumberFormat('en-IN').format(auction.reservePrice)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">EMD</p>
                                <p className="text-sm font-bold text-slate-600">
                                    ₹{new Intl.NumberFormat('en-IN').format(auction.emdAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/auctions/${auction.id}`}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-aq-blue hover:text-white transition-all transform active:scale-95 group-hover:shadow-xl group-hover:shadow-aq-blue/10"
                >
                    Interested <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
};

export default AuctionCard;
