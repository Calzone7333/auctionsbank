import React from 'react';
import { Check, ShieldCheck, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
    {
        name: 'Basic',
        price: 'Free',
        duration: 'Forever',
        icon: Zap,
        description: 'For casual browsers who want to see what is out there.',
        features: [
            'Search auctions by City',
            'View limited auction details',
            'Access to 5 auctions/day',
            'Standard Support'
        ],
        cta: 'Get Started',
        primary: false,
        gold: false
    },
    {
        name: 'Pro Investor',
        price: '₹499',
        duration: '/mo',
        icon: ShieldCheck,
        description: 'Highly recommended for active property bidders.',
        features: [
            'Unlimited Auction Search',
            'Full Detail Access',
            'Daily Email Alerts',
            'Advanced Filtering',
            'Interest List Saving'
        ],
        cta: 'Subscribe Now',
        primary: true,
        gold: false
    },
    {
        name: 'Enterprise',
        price: '₹4,999',
        duration: '/yr',
        icon: Crown,
        description: 'Bespoke solutions for agencies and funds.',
        features: [
            'All Pro Features',
            'Dedicated Account Manager',
            'Bulk CSV Data Export',
            'Priority Legal Help',
            'API Access'
        ],
        cta: 'Contact Sales',
        primary: false,
        gold: true
    }
];

const Plans = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">

            {/* Header */}
            <div className="bg-aq-blue text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-aq-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <span className="text-aq-gold font-bold tracking-widest uppercase text-sm mb-4 block">Pricing Plans</span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Invest with Intelligence</h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
                        Stop manually scrolling through endless PDF notices. <br className="hidden md:block" /> Get the most lucrative auction deals delivered directly to you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        return (
                            <div
                                key={index}
                                className={`flex flex-col p-10 bg-white rounded-[2.5rem] border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden ${plan.primary
                                        ? 'border-aq-blue shadow-xl'
                                        : plan.gold
                                            ? 'border-aq-gold shadow-lg shadow-aq-gold/5'
                                            : 'border-white shadow-md'
                                    }`}
                            >
                                {plan.primary && (
                                    <div className="absolute top-0 right-0 bg-aq-blue text-white text-[10px] font-bold px-5 py-2 rounded-bl-2xl uppercase tracking-[0.2em] shadow-sm z-10">
                                        Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.primary ? 'bg-aq-blue text-white' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{plan.name}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="mb-10">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-display font-bold text-slate-900">{plan.price}</span>
                                        <span className="text-slate-400 font-bold text-lg">{plan.duration}</span>
                                    </div>
                                </div>

                                <div className="flex-1 mb-10">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Features Included</p>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${plan.primary ? 'bg-aq-blue' : 'bg-slate-200'}`}>
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="ml-3 text-sm font-medium text-slate-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    to="/register"
                                    className={`w-full py-4 px-6 rounded-2xl text-center font-bold text-sm transition-all duration-300 transform active:scale-95 ${plan.primary
                                            ? 'bg-aq-blue text-white hover:bg-slate-900 shadow-lg shadow-aq-blue/20'
                                            : plan.gold
                                                ? 'bg-aq-gold text-white hover:bg-yellow-600 shadow-lg shadow-aq-gold/20'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ Link or Guarantee */}
                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Secure SSL encrypted payments. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Plans;
