import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Banks = () => {
    // Static list or fetch from API
    const banks = [
        { name: 'State Bank of India', count: 120, logo: 'SBI' },
        { name: 'HDFC Bank', count: 85, logo: 'HDFC' },
        { name: 'ICICI Bank', count: 92, logo: 'ICICI' },
        { name: 'Punjab National Bank', count: 64, logo: 'PNB' },
        { name: 'Bank of Baroda', count: 55, logo: 'BOB' },
        { name: 'Union Bank of India', count: 42, logo: 'UBI' },
        { name: 'Canara Bank', count: 38, logo: 'CAN' },
        { name: 'Axis Bank', count: 45, logo: 'AXIS' },
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Browse by Bank
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Select a bank to view their live auction listings.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {banks.map((bank) => (
                        <Link
                            key={bank.name}
                            to={`/auctions?bank=${encodeURIComponent(bank.name)}`}
                            className="bg-white overflow-hidden shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300 border border-gray-100 group"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-xs">
                                        {bank.logo}
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Live
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {bank.name}
                                </h3>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{bank.count} auctions</span>
                                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banks;
