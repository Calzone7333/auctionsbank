import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building2, Calendar, IndianRupee, FileText, ArrowLeft, Share2, Heart } from 'lucide-react';

const AuctionDetails = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/auctions/${id}`)
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
                <h2 className="text-2xl font-bold text-gray-800">Auction Not Found</h2>
                <Link to="/auctions" className="mt-4 text-blue-600 hover:underline flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Auctions
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ID Breadcrumb */}
                <div className="mb-6">
                    <Link to="/auctions" className="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to All Auctions
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-3">

                    {/* Left Side - Image & Main Info */}
                    <div className="lg:col-span-2 p-8 border-r border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {auction.propertyType}
                            </span>
                            <div className="flex space-x-3">
                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart className="h-6 w-6" />
                                </button>
                                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                                    <Share2 className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{auction.title}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-center">
                                <Building2 className="h-6 w-6 text-blue-500 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Bank</p>
                                    <p className="font-semibold text-gray-900">{auction.bankName}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-6 w-6 text-red-500 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-semibold text-gray-900">{auction.cityName}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <IndianRupee className="h-6 w-6 text-green-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Reserve Price</p>
                                    <p className="font-semibold text-gray-900 text-lg">
                                        ₹{new Intl.NumberFormat('en-IN').format(auction.reservePrice)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-6 w-6 text-orange-500 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Auction Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(auction.auctionDate).toLocaleDateString(undefined, {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Property Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {auction.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Actions & Documents */}
                    <div className="p-8 bg-gray-50">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Auction Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">EMD Amount</span>
                                    <span className="font-semibold text-gray-900">₹{new Intl.NumberFormat('en-IN').format(auction.emdAmount)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Auction Type</span>
                                    <span className="font-semibold text-gray-900">E-Auction</span>
                                </div>
                            </div>

                            <a
                                href={auction.noticeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FileText className="mr-2 h-4 w-4" /> Download Official Notice
                            </a>
                        </div>

                        <div className="bg-blue-900 rounded-xl p-6 text-white">
                            <h3 className="text-lg font-bold mb-2">Need Assistance?</h3>
                            <p className="text-blue-100 text-sm mb-4">
                                Get legal help or loan assistance for this property.
                            </p>
                            <button className="w-full bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition">
                                Request Callback
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuctionDetails;
