import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, MessageSquare, Book, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'auction', name: 'Auction Process', icon: Book },
    { id: 'security', name: 'Security & Legal', icon: Shield },
];

const faqs = [
    {
        category: 'general',
        question: "What is Aquection?",
        answer: "Aquection is India's premier aggregator for bank auction properties. We simplify the search process by bringing multiple bank listings into one easy-to-use platform, providing you with data-driven insights to make informed decisions."
    },
    {
        category: 'general',
        question: "Is there a fee to search for properties?",
        answer: "No, searching for properties on Aquection includes a free tier. We also offer premium plans for advanced features like detailed reports, legal status checks, and dedicated support."
    },
    {
        category: 'auction',
        question: "How do I participate in an auction?",
        answer: "To participate, you typically need to visit the specific bank's official auction portal (which we link to), register there, submit the Earnest Money Deposit (EMD) as specified in the tender document, and complete their KYC process."
    },
    {
        category: 'auction',
        question: "What is EMD (Earnest Money Deposit)?",
        answer: "EMD is a refundable security deposit that a bidder must submit to the bank to demonstrate serious interest in buying the property. It is usually 10% of the reserve price. If you win, it's adjusted against the final price; if you lose, it's refunded."
    },
    {
        category: 'auction',
        question: "Is the reserve price the final price?",
        answer: "No, the reserve price is merely the starting point. It is the minimum price below which the bank will not accept bids. The final sale price is determined during the live e-auction process."
    },
    {
        category: 'security',
        question: "Are the property titles verified?",
        answer: "We aggregate listings from verified banking sources. However, 'As is where is' is the standard rule for auctions. We strongly recommend that you perform independent legal due diligence regarding the property's title and encumbrances before bidding."
    },
    {
        category: 'security',
        question: "Can I inspect the property before bidding?",
        answer: "Yes, banks usually specify an inspection date and time in the public notice. We highly recommend visiting the property physically to assess its condition and occupancy status."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState('general');

    const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* Header */}
            <div className="bg-slate-50 border-b border-gray-100 py-20 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm mb-4">Support Center</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">How can we help?</h1>

                    {/* Search Bar - Visual Only for now */}
                    <div className="max-w-md mx-auto relative mt-8">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                            placeholder="Search for answers..."
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Category Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Categories</h3>
                        {categories.map(category => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => { setActiveCategory(category.id); setOpenIndex(null); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeCategory === category.id
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${activeCategory === category.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* FAQ List */}
                    <div className="lg:col-span-3">
                        <div className="space-y-4">
                            {filteredFaqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-2xl transition-all duration-200 ${openIndex === index
                                            ? 'border-blue-100 bg-blue-50/30'
                                            : 'border-slate-100 bg-white hover:border-slate-200'
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full flex items-start justify-between p-6 text-left focus:outline-none"
                                    >
                                        <span className={`text-base font-bold pr-8 transition-colors ${openIndex === index ? 'text-blue-700' : 'text-slate-800'
                                            }`}>
                                            {faq.question}
                                        </span>
                                        <span className={`flex-shrink-0 mt-1 ml-4 p-1 rounded-full transition-all ${openIndex === index ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-50 text-slate-400'
                                            }`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </span>
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact CTA */}
                        <div className="mt-16 bg-slate-900 rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
                            {/* Abstract bg shapes */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="p-3 bg-white/10 rounded-xl mb-6 backdrop-blur-sm">
                                    <MessageSquare className="w-6 h-6 text-blue-300" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">Can't find the answer you're looking for? Our team is happy to help.</p>
                                <Link
                                    to="/contact"
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/50"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
