import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "What is Aquection?",
        answer: "Aquection is India's premier aggregator for bank auction properties. We simplify the search process by bringing multiple bank listings into one easy-to-use platform."
    },
    {
        question: "How do I participate in an auction?",
        answer: "To participate, you typically need to register on the specific bank's portal, submit the Earnest Money Deposit (EMD), and complete the KYC process. We provide the notice details to help you get started."
    },
    {
        question: "Is the reserve price the final price?",
        answer: "No, the reserve price is the minimum price at which the bank is willing to sell the property. The final price depends on the bidding process."
    },
    {
        question: "Are the property titles verified?",
        answer: "While we list auctions from verified banks, we strongly recommend that you perform independent legal due diligence before bidding on any property."
    },
    {
        question: "How often are new properties added?",
        answer: "We update our database daily with new auction notices from over 50+ national and private banks across India."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="bg-slate-50 min-h-screen font-sans py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex p-3 bg-aq-blue/5 rounded-2xl text-aq-blue mb-4">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-slate-500 text-lg">Everything you need to know about the auction process.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-slate-50"
                            >
                                <span className="font-bold text-slate-800 pr-8">{faq.question}</span>
                                {openIndex === index ? <ChevronUp className="w-5 h-5 text-aq-blue" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-aq-blue rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-aq-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <h2 className="text-3xl font-display font-bold mb-6 relative z-10">Still have questions?</h2>
                    <p className="text-slate-300 mb-10 relative z-10">We're here to help you navigate your first property investment.</p>
                    <a href="/contact" className="inline-block bg-aq-gold text-white font-bold py-4 px-10 rounded-2xl hover:bg-yellow-600 transition-all shadow-xl shadow-aq-gold/20 relative z-10">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
