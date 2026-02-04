import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
    {
        name: 'Basic',
        price: 'Free',
        duration: 'Forever',
        features: [
            'Search auctions by City',
            'View limited auction details',
            'Access to 5 auctions/day',
            'No email alerts'
        ],
        cta: 'Get Started',
        primary: false
    },
    {
        name: 'Pro Investor',
        price: '₹499',
        duration: '/month',
        features: [
            'Unlimited Auction Search',
            'Full Auction Details (Reserve Price, EMD)',
            'Daily Email Alerts for your City',
            'Advanced Filters',
            'Save Unlimited Auctions'
        ],
        cta: 'Subscribe Now',
        primary: true
    },
    {
        name: 'Enterprise',
        price: '₹4,999',
        duration: '/year',
        features: [
            'All Pro Features',
            'Dedicated Account Manager',
            'Bulk Data Export (CSV)',
            'Priority Legal Support',
            'API Access'
        ],
        cta: 'Contact Sales',
        primary: false
    }
];

const Plans = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Pricing</h2>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Plans for every investor.
                    </p>
                    <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
                        Stop wasting time searching manually. Get the best auction deals delivered to your inbox.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                    {plans.map((plan, index) => (
                        <div key={index} className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${plan.primary ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}`}>
                            {plan.primary && (
                                <div className="absolute top-0 right-0 -mr-1 -mt-1 w-32 rounded-bl-xl rounded-tr-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-3 py-1 text-right shadow-sm">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                                <p className="mt-4 flex items-baseline text-gray-900">
                                    <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                                    {plan.duration !== 'Forever' && <span className="ml-1 text-xl font-semibold text-gray-500">{plan.duration}</span>}
                                </p>
                                <ul className="mt-6 space-y-6">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex">
                                            <Check className="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                                            <span className="ml-3 text-gray-500">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                to="/register"
                                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${plan.primary
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Plans;
