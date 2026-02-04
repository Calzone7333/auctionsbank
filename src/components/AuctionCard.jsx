import React from 'react';
import { Calendar, MapPin, Building2, IndianRupee } from 'lucide-react';

const AuctionCard = ({ auction }) => {
    return (
        <div className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden h-full">
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${auction.propertyType === 'Residential' ? 'bg-green-100 text-green-800' :
                                auction.propertyType === 'Commercial' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {auction.propertyType}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">ID: #{auction.id}</span>
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-gray-900 line-clamp-2">
                        {auction.title}
                    </h3>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                            <Building2 className="flex-shrink-0 h-4 w-4 mr-2 text-blue-500" />
                            <span className="truncate">{auction.bankName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="flex-shrink-0 h-4 w-4 mr-2 text-red-500" />
                            <span className="truncate">{auction.cityName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 h-4 w-4 mr-2 text-orange-500" />
                            <span>{new Date(auction.auctionDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-gray-500">Reserve Price</p>
                                <div className="flex items-baseline">
                                    <IndianRupee className="h-4 w-4 text-gray-900" />
                                    <span className="text-lg font-bold text-gray-900">
                                        {new Intl.NumberFormat('en-IN').format(auction.reservePrice)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">EMD</p>
                                <div className="flex items-baseline">
                                    <IndianRupee className="h-3 w-3 text-gray-500" />
                                    <span className="text-sm font-semibold text-gray-500">
                                        {new Intl.NumberFormat('en-IN').format(auction.emdAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <a
                        href={auction.noticeUrl || "#"}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        View Details
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AuctionCard;
